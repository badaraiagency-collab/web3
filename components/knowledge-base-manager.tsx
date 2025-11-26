"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Save, Loader2, FileText, HelpCircle, AlertCircle, PhoneIncoming, PhoneOutgoing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

interface QAPair {
  id: string
  question: string
  answer: string
}

interface KnowledgeBaseData {
  businessScenario: string
  companyInfo: string
  mainScript: string
  qaList: QAPair[]
}

type KnowledgeBaseType = 'inbound' | 'outbound'

export function KnowledgeBaseManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<KnowledgeBaseType>('inbound')
  
  // Inbound knowledge base state
  const [inboundBusinessScenario, setInboundBusinessScenario] = useState("")
  const [inboundCompanyInfo, setInboundCompanyInfo] = useState("")
  const [inboundMainScript, setInboundMainScript] = useState("")
  const [inboundQaList, setInboundQaList] = useState<QAPair[]>([])
  const [inboundHasChanges, setInboundHasChanges] = useState(false)
  
  // Outbound knowledge base state
  const [outboundBusinessScenario, setOutboundBusinessScenario] = useState("")
  const [outboundCompanyInfo, setOutboundCompanyInfo] = useState("")
  const [outboundMainScript, setOutboundMainScript] = useState("")
  const [outboundQaList, setOutboundQaList] = useState<QAPair[]>([])
  const [outboundHasChanges, setOutboundHasChanges] = useState(false)
  
  const { toast } = useToast()

  // Load existing configuration
  useEffect(() => {
    loadKnowledgeBase()
  }, [])

  const loadKnowledgeBase = async () => {
    setIsLoading(true)
    try {
      const config = await apiService.getConfiguration({
        showToast: false,
        forceRefresh: true
      })

      if (config.success && config.configuration) {
        // Load inbound knowledge base
        if (config.configuration.inbound_call_knowledge_base) {
          try {
            const parsed: KnowledgeBaseData = JSON.parse(config.configuration.inbound_call_knowledge_base)
            setInboundBusinessScenario(parsed.businessScenario || "")
            setInboundCompanyInfo(parsed.companyInfo || "")
            setInboundMainScript(parsed.mainScript || "")
            setInboundQaList(parsed.qaList || [])
          } catch (e) {
            // If parsing fails, initialize with empty data
            setInboundBusinessScenario("")
            setInboundCompanyInfo("")
            setInboundMainScript("")
            setInboundQaList([])
          }
        }

        // Load outbound knowledge base
        if (config.configuration.outbound_call_knowledge_base) {
          try {
            const parsed: KnowledgeBaseData = JSON.parse(config.configuration.outbound_call_knowledge_base)
            setOutboundBusinessScenario(parsed.businessScenario || "")
            setOutboundCompanyInfo(parsed.companyInfo || "")
            setOutboundMainScript(parsed.mainScript || "")
            setOutboundQaList(parsed.qaList || [])
          } catch (e) {
            // If parsing fails, initialize with empty data
            setOutboundBusinessScenario("")
            setOutboundCompanyInfo("")
            setOutboundMainScript("")
            setOutboundQaList([])
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load knowledge base configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions for current tab
  const getCurrentState = () => {
    if (activeTab === 'inbound') {
      return {
        businessScenario: inboundBusinessScenario,
        companyInfo: inboundCompanyInfo,
        mainScript: inboundMainScript,
        qaList: inboundQaList,
        setBusinessScenario: setInboundBusinessScenario,
        setCompanyInfo: setInboundCompanyInfo,
        setMainScript: setInboundMainScript,
        setQaList: setInboundQaList,
        hasChanges: inboundHasChanges,
        setHasChanges: setInboundHasChanges
      }
    } else {
      return {
        businessScenario: outboundBusinessScenario,
        companyInfo: outboundCompanyInfo,
        mainScript: outboundMainScript,
        qaList: outboundQaList,
        setBusinessScenario: setOutboundBusinessScenario,
        setCompanyInfo: setOutboundCompanyInfo,
        setMainScript: setOutboundMainScript,
        setQaList: setOutboundQaList,
        hasChanges: outboundHasChanges,
        setHasChanges: setOutboundHasChanges
      }
    }
  }

  const addQAPair = () => {
    const state = getCurrentState()
    const newQA: QAPair = {
      id: `qa-${Date.now()}`,
      question: "",
      answer: ""
    }
    state.setQaList([...state.qaList, newQA])
    state.setHasChanges(true)
  }

  const updateQAPair = (id: string, field: 'question' | 'answer', value: string) => {
    const state = getCurrentState()
    state.setQaList(state.qaList.map(qa => 
      qa.id === id ? { ...qa, [field]: value } : qa
    ))
    state.setHasChanges(true)
  }

  const removeQAPair = (id: string) => {
    const state = getCurrentState()
    state.setQaList(state.qaList.filter(qa => qa.id !== id))
    state.setHasChanges(true)
  }

  const handleSave = async () => {
    const state = getCurrentState()
    
    // Validate required fields
    if (!state.businessScenario.trim()) {
      toast({
        title: "Validation Error",
        description: "Business scenario is required",
        variant: "destructive",
      })
      return
    }

    if (!state.companyInfo.trim()) {
      toast({
        title: "Validation Error",
        description: "Company information is required",
        variant: "destructive",
      })
      return
    }

    if (!state.mainScript.trim()) {
      toast({
        title: "Validation Error",
        description: "Main agent script is required",
        variant: "destructive",
      })
      return
    }

    // Build the knowledge base JSON for current tab
    const knowledgeBaseData: KnowledgeBaseData = {
      businessScenario: state.businessScenario.trim(),
      companyInfo: state.companyInfo.trim(),
      mainScript: state.mainScript.trim(),
      qaList: state.qaList.filter(qa => qa.question.trim() && qa.answer.trim())
    }

    setIsSaving(true)
    try {
      // Load current configuration to preserve the other tab's data
      const config = await apiService.getConfiguration({
        showToast: false,
        forceRefresh: false
      })

      const updatePayload: any = {}
      
      // Add current tab's knowledge base
      if (activeTab === 'inbound') {
        updatePayload.inbound_call_knowledge_base = JSON.stringify(knowledgeBaseData, null, 2)
        // Preserve outbound if it exists in the current config
        if (config.success && config.configuration?.outbound_call_knowledge_base) {
          updatePayload.outbound_call_knowledge_base = config.configuration.outbound_call_knowledge_base
        }
      } else {
        updatePayload.outbound_call_knowledge_base = JSON.stringify(knowledgeBaseData, null, 2)
        // Preserve inbound if it exists in the current config
        if (config.success && config.configuration?.inbound_call_knowledge_base) {
          updatePayload.inbound_call_knowledge_base = config.configuration.inbound_call_knowledge_base
        }
      }

      const result = await apiService.updateConfiguration(updatePayload)

      if (result.success) {
        toast({
          title: "Success!",
          description: `${activeTab === 'inbound' ? 'Inbound' : 'Outbound'} knowledge base updated successfully`,
          variant: "default",
        })
        state.setHasChanges(false)
      } else {
        throw new Error(result.message || "Failed to update configuration")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save knowledge base",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderKnowledgeBaseForm = (type: KnowledgeBaseType) => {
    const state = getCurrentState()
    const isInbound = type === 'inbound'
    
    return (
      <div className="space-y-6">
        {/* Business Scenario */}
        <div className="space-y-2">
          <Label htmlFor={`businessScenario-${type}`} className="text-base font-semibold">
            Business Scenario <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={`businessScenario-${type}`}
            placeholder="Describe your business, what you do, your products/services, and your value proposition..."
            value={state.businessScenario}
            onChange={(e) => {
              state.setBusinessScenario(e.target.value)
              state.setHasChanges(true)
            }}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            This helps the AI understand your business context and respond appropriately
          </p>
        </div>

        {/* Company Information */}
        <div className="space-y-2">
          <Label htmlFor={`companyInfo-${type}`} className="text-base font-semibold">
            Company Information <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={`companyInfo-${type}`}
            placeholder="Add company details like company name, location, hours, contact info, etc..."
            value={state.companyInfo}
            onChange={(e) => {
              state.setCompanyInfo(e.target.value)
              state.setHasChanges(true)
            }}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Provide essential company information that the AI should know about
          </p>
        </div>

        {/* Main Script */}
        <div className="space-y-2">
          <Label htmlFor={`mainScript-${type}`} className="text-base font-semibold">
            Main Agent Script <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id={`mainScript-${type}`}
            placeholder={isInbound 
              ? "Paste your detailed script for handling incoming calls. Include how the agent should greet callers, handle inquiries, provide information, and assist customers..."
              : "Paste your detailed script for making outbound calls. Include how the agent should introduce themselves, present offers, handle objections, and close deals..."
            }
            value={state.mainScript}
            onChange={(e) => {
              state.setMainScript(e.target.value)
              state.setHasChanges(true)
            }}
            rows={10}
            className="resize-none font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            {isInbound
              ? "Provide a detailed script to guide the AI agent on how to handle incoming calls, assist customers, and provide excellent service"
              : "Provide a detailed script to guide the AI agent on how to make outbound calls, present offers, handle objections, and achieve call objectives"
            }
          </p>
        </div>

        {/* Q&A Pairs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Common Questions & Answers
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Add frequently asked questions and their answers to help the AI respond accurately
              </p>
            </div>
            <Button
              onClick={addQAPair}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {state.qaList.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No questions added yet. Click "Add Question" to start building your knowledge base.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {state.qaList.map((qa, index) => (
                <Card key={qa.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Question {index + 1}
                      </span>
                      <Button
                        onClick={() => removeQAPair(qa.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`question-${qa.id}-${type}`} className="text-sm">
                          Question
                        </Label>
                        <Input
                          id={`question-${qa.id}-${type}`}
                          placeholder="e.g., What are your business hours?"
                          value={qa.question}
                          onChange={(e) => updateQAPair(qa.id, 'question', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`answer-${qa.id}-${type}`} className="text-sm">
                          Answer
                        </Label>
                        <Textarea
                          id={`answer-${qa.id}-${type}`}
                          placeholder="Provide a clear and concise answer..."
                          value={qa.answer}
                          onChange={(e) => updateQAPair(qa.id, 'answer', e.target.value)}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {state.hasChanges && (
              <span className="text-orange-600 font-medium">
                ⚠️ You have unsaved changes
              </span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !state.hasChanges}
            className="flex items-center gap-2"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save {isInbound ? 'Inbound' : 'Outbound'} Knowledge Base
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading knowledge base...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          AI Knowledge Base Configuration
        </CardTitle>
        <CardDescription>
          Configure your AI agent's knowledge base for inbound and outbound calls with business information and common questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as KnowledgeBaseType)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="inbound" className="flex items-center gap-2">
              <PhoneIncoming className="h-4 w-4" />
              Inbound Calls <span className="text-red-500">*</span>
            </TabsTrigger>
            <TabsTrigger value="outbound" className="flex items-center gap-2">
              <PhoneOutgoing className="h-4 w-4" />
              Outbound Calls <span className="text-red-500">*</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbound">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Configure the knowledge base for <strong>incoming calls</strong>. This will be used when customers call your business.
                </AlertDescription>
              </Alert>
              {renderKnowledgeBaseForm('inbound')}
            </div>
          </TabsContent>
          
          <TabsContent value="outbound">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Configure the knowledge base for <strong>outgoing calls</strong>. This will be used when making calls to prospects or customers.
                </AlertDescription>
              </Alert>
              {renderKnowledgeBaseForm('outbound')}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

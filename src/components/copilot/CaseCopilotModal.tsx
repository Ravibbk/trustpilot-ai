'use client';

import React, { useState } from 'react';
import { CaseReview } from '@/types';
import { Bot, Send, Sparkles, X, ChevronRight, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CaseCopilotProps {
  caseData: CaseReview;
  isOpen: boolean;
  onClose: () => void;
  onApplyAction?: (actionText: string) => void;
}

interface Message {
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  groundedSignals?: string[];
  suggestedActions?: string[];
}

export function CaseCopilotModal({ caseData, isOpen, onClose, onApplyAction }: CaseCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ASSISTANT',
      text: `Hello, I'm the **TrustPilot Case Copilot**. I have indexed all verification telemetry, OCR extractions, and fraud signals for **${caseData.customerName}** (${caseData.caseNumber}).\n\nHow can I assist your investigation?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Why was this customer flagged?',
    'Summarize this case',
    'What evidence supports the current risk level?',
    'What should the analyst verify next?',
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: caseData.id, query: textToSend }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setMessages(prev => [...prev, data.answer]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ASSISTANT',
            text: 'I could not process that request. Please try selecting one of the suggested prompts.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e: any) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ASSISTANT',
          text: `Error contacting Copilot service: ${e.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Case Copilot</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Grounded Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Contextual assist for {caseData.caseNumber} • {caseData.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <p className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Suggested Analyst Queries:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-xs bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-700 border border-slate-200 hover:border-brand-300 px-2.5 py-1 rounded-full transition-all text-left shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex flex-col ${m.sender === 'USER' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-3.5 text-xs leading-relaxed shadow-subtle ${
                  m.sender === 'USER'
                    ? 'bg-brand-600 text-white rounded-br-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>

                {/* Grounded signals badges */}
                {m.groundedSignals && m.groundedSignals.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Grounded Evidence Citations:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {m.groundedSignals.map((sig, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested actions buttons */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Applicable Next Actions:
                    </p>
                    <div className="flex flex-col gap-1">
                      {m.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => onApplyAction && onApplyAction(act)}
                          className="text-[11px] text-left px-2.5 py-1.5 rounded-md bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 flex items-center justify-between font-medium transition-colors"
                        >
                          <span>{act}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-slate-50 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium ml-1">Analyzing case facts...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about this case (e.g. why was this customer flagged?)"
              className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Responses are derived strictly from active case data and deterministic risk engine models.
          </p>
        </div>
      </div>
    </div>
  );
}

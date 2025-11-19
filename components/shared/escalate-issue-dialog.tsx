"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EscalationRequest } from "@/types/api";
import { toast } from "sonner";

interface EscalateIssueDialogProps {
  issueId: string;
  issueType: EscalationRequest["issueType"];
  fromDepartment: EscalationRequest["fromDepartment"];
  trigger?: React.ReactNode;
  onEscalate?: (request: EscalationRequest) => Promise<void>;
}

export function EscalateIssueDialog({
  issueId,
  issueType,
  fromDepartment,
  trigger,
  onEscalate,
}: EscalateIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    toDepartment: "" as EscalationRequest["toDepartment"],
    priority: "medium" as EscalationRequest["priority"],
    subject: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.toDepartment || !formData.subject || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const escalationRequest: EscalationRequest = {
      issueId,
      issueType,
      fromDepartment,
      toDepartment: formData.toDepartment,
      priority: formData.priority,
      subject: formData.subject,
      description: formData.description,
    };

    try {
      if (onEscalate) {
        await onEscalate(escalationRequest);
      } else {
        // Default behavior - log to console
        console.log("Escalation request:", escalationRequest);
        toast.success(
          `Issue escalated to ${formData.toDepartment} department`
        );
      }
      setOpen(false);
      setFormData({
        toDepartment: "" as EscalationRequest["toDepartment"],
        priority: "medium",
        subject: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to escalate issue. Please try again.");
      console.error("Escalation error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <AlertCircle className="mr-2 h-4 w-4" />
            Escalate
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Escalate Issue</DialogTitle>
            <DialogDescription>
              Escalate this {issueType} to another department for assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="from">From Department</Label>
              <Input
                id="from"
                value={fromDepartment}
                disabled
                className="capitalize"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">To Department *</Label>
              <Select
                value={formData.toDepartment}
                onValueChange={(value: EscalationRequest["toDepartment"]) =>
                  setFormData({ ...formData, toDepartment: value })
                }
              >
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {fromDepartment !== "support" && (
                    <SelectItem value="support">Support</SelectItem>
                  )}
                  {fromDepartment !== "sales" && (
                    <SelectItem value="sales">Sales</SelectItem>
                  )}
                  {fromDepartment !== "marketing" && (
                    <SelectItem value="marketing">Marketing</SelectItem>
                  )}
                  {fromDepartment !== "operations" && (
                    <SelectItem value="operations">Operations</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: EscalationRequest["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue and why it needs escalation"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Escalating..." : "Escalate Issue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

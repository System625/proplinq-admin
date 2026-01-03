'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types/api';

interface ActivityFormProps {
  activity?: Activity;
  onSubmit: (data: CreateActivityRequest | UpdateActivityRequest) => Promise<void>;
  onCancel: () => void;
}

interface FormData {
  type: string;
  subject: string;
  description: string;
  activity_date: string;
  duration_minutes: number;
  outcome: string;
  call_direction: string;
  phone_number: string;
  email_to: string;
  email_subject: string;
  location: string;
  meeting_type: string;
  priority?: string;
  status?: string;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const [activityType, setActivityType] = useState<string>(activity?.type || 'note');

  const form = useForm<FormData>({
    defaultValues: activity
      ? {
          type: activity.type,
          subject: activity.subject,
          description: activity.description || '',
          activity_date: new Date(activity.activity_date).toISOString().slice(0, 16),
          duration_minutes: activity.duration_minutes || 0,
          outcome: activity.outcome || '',
          // Metadata fields
          call_direction: activity.metadata?.call_direction || '',
          phone_number: activity.metadata?.phone_number || '',
          email_to: activity.metadata?.email_to || '',
          email_subject: activity.metadata?.email_subject || '',
          location: activity.metadata?.location || '',
          meeting_type: activity.metadata?.meeting_type || '',
        }
      : {
          type: 'note',
          subject: '',
          description: '',
          activity_date: new Date().toISOString().slice(0, 16),
          duration_minutes: 0,
          outcome: '',
          call_direction: '',
          phone_number: '',
          email_to: '',
          email_subject: '',
          location: '',
          meeting_type: '',
        },
  });

  const handleSubmit = async (data: FormData) => {
    // Build the request based on activity type
    const baseData = {
      type: data.type,
      subject: data.subject,
      description: data.description,
      activity_date: new Date(data.activity_date).toISOString(),
    };

    let requestData: CreateActivityRequest | UpdateActivityRequest;

    switch (data.type) {
      case 'note':
        requestData = baseData;
        break;

      case 'call':
        requestData = {
          ...baseData,
          duration_minutes: data.duration_minutes,
          outcome: data.outcome,
          metadata: {
            call_direction: data.call_direction,
            phone_number: data.phone_number,
          },
        };
        break;

      case 'email':
        requestData = {
          ...baseData,
          outcome: data.outcome,
          metadata: {
            email_to: data.email_to,
            email_subject: data.email_subject,
          },
        };
        break;

      case 'meeting':
        requestData = {
          ...baseData,
          duration_minutes: data.duration_minutes,
          outcome: data.outcome,
          metadata: {
            location: data.location,
            meeting_type: data.meeting_type,
          },
        };
        break;

      case 'task':
        requestData = {
          ...baseData,
          metadata: {
            priority: data.priority || 'medium',
            status: data.status || 'pending',
          },
        };
        break;

      default:
        requestData = baseData;
    }

    await onSubmit(requestData);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          rules={{ required: 'Type is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Type *</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setActivityType(value);
                }}
                defaultValue={field.value}
                disabled={!!activity}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject"
          rules={{ required: 'Subject is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Activity subject" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Activity details..." rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activity_date"
          rules={{ required: 'Date is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time *</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type-specific fields */}
        {(activityType === 'call' || activityType === 'meeting') && (
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="30"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(activityType === 'call' || activityType === 'email' || activityType === 'meeting') && (
          <FormField
            control={form.control}
            name="outcome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outcome</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="follow_up">Follow Up Required</SelectItem>
                    <SelectItem value="no_answer">No Answer</SelectItem>
                    <SelectItem value="voicemail">Voicemail</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {activityType === 'call' && (
          <>
            <FormField
              control={form.control}
              name="call_direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Direction</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+1 (555) 000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {activityType === 'email' && (
          <>
            <FormField
              control={form.control}
              name="email_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="recipient@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email_subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email subject line" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {activityType === 'meeting' && (
          <>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Conference Room A or Zoom link" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meeting_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in_person">In Person</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving...'
              : activity
                ? 'Update Activity'
                : 'Create Activity'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

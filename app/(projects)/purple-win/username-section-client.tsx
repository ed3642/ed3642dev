'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUsername } from '@/providers/username-provider'
import { useState } from 'react'
import { toast } from 'sonner'

export function UserNameSectionClient() {
  const { username, setUsername } = useUsername()
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(username)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim().length < 2) {
      toast.error('Username must be at least 2 characters')
      return
    }
    setUsername(inputValue)
    setIsEditing(false)
    toast.success(`Username set to: ${inputValue}`)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="username">Display Name</Label>
          <Input
            id="username"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter display name"
            maxLength={20}
            autoFocus
          />
        </div>
        <Button type="submit" size="sm">
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsEditing(false)
            setInputValue(username)
          }}
        >
          Cancel
        </Button>
      </form>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Playing as:</span>
        <span className="font-bold">{username}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
        Change Name
      </Button>
    </div>
  )
}

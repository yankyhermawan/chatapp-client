import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from '../ui/command'
import { Input } from '../ui/input'
import { Command as CommandPrimitive } from 'cmdk'
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect,
} from 'react'

import { Skeleton } from '../ui/skeleton'

import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export type Option = Record<'value' | 'label', string> & Record<string, string>

type AutoCompleteProps = {
  items: Option[]
  emptyMessage?: string
  value?: string
  onSearch: (value: string) => void
  onSelect: (value: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export const AutoComplete = ({
  items,
  placeholder,
  emptyMessage = 'Not Found',
  value,
  onSearch,
  onSelect,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>(value || '')
  const [inputValue, setInputValue] = useState<string>(
    items.find((it) => it.value === value)?.label || ''
  )
  const [firstRender, setFirstRender] = useState(true)

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true)
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = items.find((item) => item.label === input.value)
        if (optionToSelect) {
          setSelected(optionToSelect.value)
          onSelect(optionToSelect.value)
        }
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen, items, onSelect]
  )

  const handleBlur = useCallback(() => {
    const selectedLabel = items.find((it) => it.value === selected)?.label || ''
    setOpen(false)
    setInputValue(selectedLabel)
  }, [selected])

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.label)

      setSelected(selectedOption.value)
      onSelect(selectedOption.value)

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [onSelect]
  )

  const handleValueChange = (e: string) => {
    setInputValue(e)
    onSearch(e)
  }

  useEffect(() => {
    if (value && items.length > 0 && firstRender) {
      setFirstRender(false)
      setInputValue(items.find((it) => it.value === value)?.label || '')
    }
  }, [items, value])

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          asChild
          className="bg-white"
          disabled={disabled}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          onValueChange={isLoading ? undefined : handleValueChange}
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
        >
          <Input disabled={disabled} placeholder={placeholder} />
        </CommandInput>
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none',
            isOpen ? 'block' : 'hidden'
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {items.length > 0 && !isLoading ? (
              <CommandGroup>
                {items.map((item) => {
                  const isSelected = selected === item.value
                  return (
                    <CommandItem
                      className={cn(
                        'flex w-full items-center gap-2 z-50',
                        !isSelected ? 'pl-8' : null
                      )}
                      key={item.value}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      onSelect={() => handleSelectOption(item)}
                      value={item.label}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {item.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  )
}

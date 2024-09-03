import React, { useState } from 'react'

export const useForm = <T extends Record<string, unknown>>(initialForm: T) => {
  const [form, setForm] = useState(initialForm)

  const onInputChange = <
    T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >({
    target
  }: React.ChangeEvent<T>) => {
    const { name, value } = target
    setForm({
      ...form,
      [name]: value
    })
  }

  const resetForm = () => {
    setForm(initialForm)
  }

  const setFormValue = (name: keyof T, value: unknown) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  return {
    form,
    onInputChange,
    resetForm,
    setForm: setFormValue,
    ...form
  }
}

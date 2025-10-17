import { useState, useCallback } from 'react';
import { validation } from '../utils/validation';

export const useForm = (initialState, validationRules = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  }, [errors]);

  const validateField = useCallback((field, value) => {
    if (validationRules[field]) {
      const error = validation.validateField(value, validationRules[field]);
      setErrors(prev => ({
        ...prev,
        [field]: error,
      }));
      return !error;
    }
    return true;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validation.validateField(formData[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules]);

  const setFieldTouched = useCallback((field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialState]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [formData, validateForm]);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    updateField,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    setFormData,
  };
};
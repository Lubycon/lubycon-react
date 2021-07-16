import { useState, Dispatch } from 'react';

export interface BindInput {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface UseBindInput {
  bind: BindInput;
  setValue: Dispatch<React.SetStateAction<string>>;
}

const useBindInput = (initialValue?: string, inputValidator?: (text: string) => boolean) => {
  const [value, setValue] = useState(initialValue ?? '');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: text },
    } = e;

    if (inputValidator) {
      const willUpdate = inputValidator(text);
      if (willUpdate) {
        setValue(text);
      }
    } else {
      setValue(text);
    }
  };

  const clearValue = () => {
    setValue('');
  };

  return {
    bind: {
      value,
      onChange,
    },
    setValue,
    clearValue,
  };
};

export default useBindInput;

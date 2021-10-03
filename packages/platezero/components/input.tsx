import cx from 'classnames'

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {}

export const Input = ({ className, ...props }: InputProps) => (
  <input
    className={cx(
      'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
      className
    )}
    {...props}
  />
)

interface FormInputProps extends InputProps {
  label: string
}

export const FormInput = ({
  className,
  label,
  id,
  ...props
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className={cx(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {}

export const Textarea = ({ className, ...props }: TextareaProps) => (
  <textarea
    className={cx(
      'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
      className
    )}
    {...props}
  />
)

interface FormTextareaProps extends TextareaProps {
  label: string
}

export const FormTextarea = ({
  className,
  label,
  id,
  ...props
}: FormTextareaProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          className={cx(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            className
          )}
          {...props}
        />
      </div>
    </div>
  )
}

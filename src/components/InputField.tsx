import type { InputFieldProps } from "../types";

const InputField = ({ label, name, type = 'text', required = false, placeholder = '', customClass = '', onChange }: InputFieldProps) => (
    <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 tracking-[0.03em]">
            {label}{required && <span className="text-[var(--amber)] ml-0.5">*</span>}
        </label>
        <input
            type={type} name={name} required={required}
            placeholder={placeholder} onChange={onChange}
            className={`foundry-input ${customClass}`}
        />
    </div>
);

export default InputField;



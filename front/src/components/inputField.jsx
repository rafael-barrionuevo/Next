
export default function InputField({
    id,
    type = 'text',
    name,
    placeholder = '',
    onChange = () => {},
    required = false,
    onFocus,
    className =""
}) {
    return (          
        <div className="input-field"> 
            <input
                id = {id}
                name = {name}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                onFocus={onFocus}
                required={required}
                className={className}
            />
        </div>
    );
}

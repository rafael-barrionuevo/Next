
export default function InputField({
    id,
    type = 'text',
    name,
    placeholder = '',
    onChange = () => {},
    required = false,
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
                required={required}
                className={className}
            />
        </div>
    );
}
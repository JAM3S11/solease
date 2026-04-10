import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const COUNTRIES_DATA = {
  'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Kericho', 'Naivasha', 'Machakos', 'Meru', 'Thika', 'Nyeri', 'Embu', 'Kitui', 'Lamu', 'Migori', 'Homa Bay', 'Kisii', 'Nyamira', 'Bomet', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Vihiga', 'West Pokot', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Laikipia', 'Isiolo', 'Marsabit', 'Mandera', 'Wajir', 'Moyale', 'Maralal'],
  'Nigeria': ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'],
  'United States': ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Uganda': ['Kampala', 'Wakiso', 'Mukono', 'Luweero', 'Jinja', 'Mbale', 'Soroti', 'Gulu', 'Lira', 'Mbarara', 'Kasese', 'Fort Portal', 'Kabarole', 'Bundibugyo', 'Kyenjojo', 'Kamwenge', 'Masindi', 'Kiryandongo', 'Bweyogerere', 'Kireka', 'Entebbe', 'Kasangati', 'Makindye', 'Namirembe', 'Nansana', 'Kigombwa'],
  'Tanzania': ['Arusha', 'Dar es Salaam', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kigoma', 'Shinyanga', 'Mwanza', 'Singida', 'Tabora', 'Iringa', 'Songea', 'Mbinga', 'Kasulu', 'Bukoba', 'Musoma', 'Babati', 'Lind'],
  'Ghana': ['Ashanti', 'Brong-Ahafo', 'Central', 'Eastern', 'Greater Accra', 'Northern', 'Upper East', 'Upper West', 'Volta', 'Western', 'Oti', 'Ahafo', 'Bono', 'Bono East', 'Savannah', 'North East', 'Western North'],
  'South Africa': ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'],
  'Canada': ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'],
  'Germany': ['Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'],
  'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Hauts-de-France', 'Grand Est', 'Provence-Alpes-Côte Azur', 'Pays de la Loire', 'Normandie', 'Bretagne', 'Bourgogne-Franche-Comté', 'Centre-Val de Loire', 'Corse'],
  'India': ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'],
  'China': ['Anhui', 'Fujian', 'Gansu', 'Guangdong', 'Guangxi', 'Guizhou', 'Hainan', 'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 'Jiangsu', 'Jiangxi', 'Jilin', 'Liaoning', 'Qinghai', 'Shaanxi', 'Shandong', 'Shanghai', 'Shanxi', 'Sichuan', 'Tianjin', 'Xinjiang', 'Yunnan', 'Zhejiang'],
  'Brazil': ['Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'],
  'Mexico': ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico State', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'],
}

export const COUNTRIES = Object.keys(COUNTRIES_DATA).sort()

export const getStatesByCountry = (country) => {
  return COUNTRIES_DATA[country] || []
}

const AREAS_DATA = {
  'Nairobi': ['Central Business District', 'Westlands', 'Kilimani', 'Kasarani', 'Kakamega', 'Kisumu', 'Mombasa', 'Eldoret', 'Nakuru', 'Malindi'],
  'Mombasa': ['Old Town', 'Mombasa CBD', 'Likoni', 'Kisauni', 'Nyali', 'Mombasa', 'Kilifi', 'Malindi', 'Diani', 'Lamu'],
  'Kisumu': ['Kisumu CBD', 'Milimani', 'Kisumu', 'Nyamasaria', 'Suna', 'Migori', 'Homa Bay', 'Kakamega', 'Siaya', 'Busia'],
  'Nakuru': ['Nakuru CBD', 'Gilgil', 'Naivasha', 'Mai Mahiu', 'Molo', 'Londiani', 'Kuresoi', 'Nakuru', 'Baringo', 'Kericho'],
  'Eldoret': ['Eldoret CBD', 'Kipkaren', 'Langas', 'Kimumu', 'Iten', 'Kitale', 'Lodwar', 'Kapengur', 'Eldoret', 'Uasin Gishu'],
  'Lagos': ['Victoria Island', 'Ikoyi', 'Lekki', 'Apapa', 'Yaba', 'Ikeja', 'Lagos Island', 'Surulere', 'Ajah', 'Badagry'],
  'Abuja': ['Central Business District', 'Wuse 2', 'Gwagwalada', 'Kuje', 'Bwari', 'Karu', 'Abaji', 'Municipal', 'AMAC'],
  'Kampala': ['Kampala Central', 'Nansana', 'Kibuye', 'Makerere', 'Kawempe', 'Rubaga', 'Nagguru', 'Nsambya', 'Bugolobi', 'Port Bell'],
  'Dar es Salaam': ['CBD', 'Oysterbay', 'Msasani', 'Kinondoni', 'Ilala', 'Temeke', 'Mwananyamala', 'Buguruni', 'Kibaha', 'Bagamoyo'],
}

export const getAreasByState = (country, state) => {
  if (!state) return []
  const key = `${state}`
  return AREAS_DATA[key] || []
}

const ComboboxInput = React.memo(({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select or type...',
  allowCustom = true,
  required,
  error,
  helpText,
  disabled,
  onEnterPress,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(inputValue.toLowerCase())
  )

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '')
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((selectedValue) => {
    setInputValue(selectedValue)
    setIsOpen(false)
    setHighlightedIndex(-1)
    const event = {
      target: {
        name: name,
        value: selectedValue
      }
    }
    onChange(event)
  }, [name, onChange])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex(prev => 
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex])
      } else if (inputValue.trim()) {
        const exactMatch = options.find(opt => 
          opt.toLowerCase() === inputValue.trim().toLowerCase()
        )
        if (exactMatch) {
          handleSelect(exactMatch)
        } else if (allowCustom) {
          handleSelect(inputValue.trim())
        }
        if (onEnterPress) {
          onEnterPress(inputValue.trim())
        }
      }
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    } else if (e.key === 'Backspace' && !inputValue && value) {
      const event = {
        target: {
          name: name,
          value: ''
        }
      }
      onChange(event)
    }
  }, [highlightedIndex, filteredOptions, inputValue, allowCustom, handleSelect, onEnterPress, onChange, name, value])

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
    
    const event = {
      target: {
        name: name,
        value: newValue
      }
    }
    onChange(event)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setInputValue('')
    setIsOpen(false)
    const event = {
      target: {
        name: name,
        value: ''
      }
    }
    onChange(event)
  }

  const showDropdown = isOpen && filteredOptions.length > 0

  return (
    <div className="w-full relative">
      <label className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider mb-2 ml-1 transition-colors duration-200 ${
        error
          ? 'text-red-600 dark:text-red-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        {Icon && <Icon size={14} className="text-blue-600 dark:text-blue-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            aria-label={label}
            aria-required={required}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-describedby={error ? `${name}-error` : undefined}
            className={`w-full px-4 py-3 pr-10 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
              disabled
                ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : error
                  ? 'bg-white dark:bg-slate-800 border-red-500 dark:border-red-500 focus:ring-red-500 text-slate-700 dark:text-slate-200'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-transparent shadow-sm text-slate-700 dark:text-slate-200'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5"
                tabIndex={-1}
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown 
              size={18} 
              className={`text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-lg max-h-60 overflow-auto"
            >
              {filteredOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                    index === highlightedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  } ${
                    index === 0 ? 'rounded-t-lg' : ''
                  } ${
                    index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''
                  }`}
                >
                  <span className="text-sm">{option}</span>
                  {option.toLowerCase() === inputValue.toLowerCase() && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
              {allowCustom && inputValue.trim() && 
               !filteredOptions.some(o => o.toLowerCase() === inputValue.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => {
                    handleSelect(inputValue.trim())
                    if (onEnterPress) {
                      onEnterPress(inputValue.trim())
                    }
                  }}
                  className="w-full px-4 py-2.5 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-b-lg border-t border-slate-100 dark:border-slate-700 flex items-center gap-2"
                >
                  <span className="text-sm">Press Enter to add: <strong>{inputValue.trim()}</strong></span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(error || helpText) && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-1.5 text-xs ${
            error 
              ? 'text-red-600 dark:text-red-400 font-medium' 
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {error || helpText}
        </motion.p>
      )}
    </div>
  )
})

ComboboxInput.displayName = 'ComboboxInput'

export default ComboboxInput
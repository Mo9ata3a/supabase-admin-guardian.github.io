
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

interface DataFormProps {
  tableName: string;
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

// Configuration des champs par table
const tableFields = {
  users: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'created_at', label: 'Date de création', type: 'date' }
  ],
  products: [
    { name: 'name', label: 'Nom du produit', type: 'text', required: true },
    { name: 'price', label: 'Prix', type: 'number', required: true },
    { name: 'category', label: 'Catégorie', type: 'text', required: true },
    { name: 'stock', label: 'Stock', type: 'number', required: true }
  ],
  orders: [
    { name: 'user_id', label: 'ID Utilisateur', type: 'number', required: true },
    { name: 'total', label: 'Total', type: 'number', required: true },
    { name: 'status', label: 'Statut', type: 'text', required: true },
    { name: 'created_at', label: 'Date de création', type: 'date' }
  ],
  categories: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text' }
  ]
};

export const DataForm = ({ tableName, initialData, onSave, onCancel }: DataFormProps) => {
  const [formData, setFormData] = useState<any>({});

  const fields = tableFields[tableName as keyof typeof tableFields] || [];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Initialiser avec des valeurs vides
      const emptyData: any = {};
      fields.forEach(field => {
        emptyData[field.name] = field.type === 'number' ? 0 : '';
      });
      setFormData(emptyData);
    }
  }, [initialData, tableName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => {
              const value = field.type === 'number' ? 
                parseFloat(e.target.value) || 0 : 
                e.target.value;
              handleChange(field.name, value);
            }}
            required={field.required}
            step={field.type === 'number' ? '0.01' : undefined}
          />
        </div>
      ))}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DataForm } from './DataForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TableManagerProps {
  tableName: string;
}

// Données de démonstration
const mockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-01-16' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2024-01-17' }
  ],
  products: [
    { id: 1, name: 'Produit A', price: 29.99, category: 'Electronics', stock: 100 },
    { id: 2, name: 'Produit B', price: 49.99, category: 'Books', stock: 50 },
    { id: 3, name: 'Produit C', price: 19.99, category: 'Clothing', stock: 200 }
  ],
  orders: [
    { id: 1, user_id: 1, total: 79.98, status: 'completed', created_at: '2024-01-18' },
    { id: 2, user_id: 2, total: 49.99, status: 'pending', created_at: '2024-01-19' }
  ],
  categories: [
    { id: 1, name: 'Electronics', description: 'Electronic devices' },
    { id: 2, name: 'Books', description: 'Books and literature' },
    { id: 3, name: 'Clothing', description: 'Apparel and accessories' }
  ]
};

export const TableManager = ({ tableName }: TableManagerProps) => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [tableName]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Simulation du chargement des données (à remplacer par appel Supabase)
      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockData[tableName as keyof typeof mockData] || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Simulation de suppression (à remplacer par appel Supabase)
      setData(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Suppression réussie",
        description: "L'élément a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'élément.",
        variant: "destructive"
      });
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        // Modification
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        ));
        toast({
          title: "Modification réussie",
          description: "L'élément a été modifié avec succès."
        });
      } else {
        // Création
        const newId = Math.max(...data.map(item => item.id), 0) + 1;
        setData(prev => [...prev, { ...formData, id: newId }]);
        toast({
          title: "Création réussie",
          description: "L'élément a été créé avec succès."
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'élément.",
        variant: "destructive"
      });
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="capitalize">Gestion de {tableName}</CardTitle>
            <CardDescription>
              {filteredData.length} élément(s) trouvé(s)
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Modifier' : 'Créer'} un élément
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Modifiez' : 'Ajoutez'} les informations ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <DataForm
                  tableName={tableName}
                  initialData={editingItem}
                  onSave={handleSave}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Table des données */}
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="capitalize">
                      {column}
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {String(item[column])}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune donnée trouvée.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

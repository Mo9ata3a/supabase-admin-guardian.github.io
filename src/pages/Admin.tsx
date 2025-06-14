
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Database, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { TableManager } from '@/components/admin/TableManager';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const { toast } = useToast();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    setSelectedTable('');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de l'interface d'administration."
    });
  };

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
              <p className="text-gray-600">Interface de gestion des données</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Table Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Tables</span>
                </CardTitle>
                <CardDescription>
                  Sélectionnez une table à gérer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['users', 'products', 'orders', 'categories'].map((table) => (
                    <Button
                      key={table}
                      variant={selectedTable === table ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedTable(table)}
                    >
                      {table}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {selectedTable ? (
              <TableManager tableName={selectedTable} />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sélectionnez une table
                    </h3>
                    <p className="text-gray-600">
                      Choisissez une table dans le menu de gauche pour commencer la gestion des données.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

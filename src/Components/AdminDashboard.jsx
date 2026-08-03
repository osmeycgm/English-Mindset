import { useState, useEffect } from 'react';
import { useUser } from './Context/UserContext';

export default function AdminDashboard() {
  const { token } = useUser();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://english-mindset-production.up.railway.app"; 
  // O "http://localhost:5000" para pruebas locales

  // Cargar lista de usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users?adminSecret=TU_ADMIN_SECRET`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para activar / desactivar
  const togglePlan = async (email, currentStatus) => {
    // Si está activo lo desactivamos, y viceversa
    const endpoint = currentStatus 
      ? `${API_URL}/api/admin/deactivate-user` 
      : `${API_URL}/api/admin/activate-user`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ email, adminSecret: 'TU_ADMIN_SECRET' })
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers(); // Recargar la lista
      }
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>⚙️ Panel de Administración</h1>
      <p>Gestión global de estudiantes y planes activos</p>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Nombre</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Proveedor</th>
              <th style={{ padding: '12px' }}>Estado Plan</th>
              <th style={{ padding: '12px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{u.name}</td>
                <td style={{ padding: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px' }}>{u.provider}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: u.hasActivePlan ? '#dcfce7' : '#fee2e2',
                    color: u.hasActivePlan ? '#15803d' : '#b91c1c'
                  }}>
                    {u.hasActivePlan ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => togglePlan(u.email, u.hasActivePlan)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      background: u.hasActivePlan ? '#ef4444' : '#22c55e',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {u.hasActivePlan ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
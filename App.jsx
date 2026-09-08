import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Users, UserPlus, Pencil, Trash2, Search, X } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = { name: "", email: "", role: "", department: "", salary: "" };

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/employees`);
      setEmployees(data);
      setError("");
    } catch {
      setError("Could not connect to the backend. Check your API URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter(e =>
      [e.name, e.email, e.role, e.department].some(v => v.toLowerCase().includes(q))
    );
  }, [employees, search]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role || !form.department || !form.salary) {
      setError("Please fill all fields.");
      return;
    }
    try {
      const payload = { ...form, salary: Number(form.salary) };
      if (editingId) {
        await axios.put(`${API}/employees/${editingId}`, payload);
      } else {
        await axios.post(`${API}/employees`, payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setError("");
      await loadEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const edit = (employee) => {
    setEditingId(employee._id);
    setForm({
      name: employee.name, email: employee.email, role: employee.role,
      department: employee.department, salary: employee.salary
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await axios.delete(`${API}/employees/${id}`);
      await loadEmployees();
    } catch {
      setError("Could not delete employee.");
    }
  };

  const cancel = () => { setEditingId(null); setForm(emptyForm); };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">EMS</div>
          <div className="brand-sub">Employee Management System</div>
        </div>
        <div className="header-pill"><Users size={17}/> {employees.length} Employees</div>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">ADMIN DASHBOARD</p>
            <h1>Manage your team<br/><span>with confidence.</span></h1>
            <p className="hero-copy">Add, update, search and organize employee records from one clean dashboard.</p>
          </div>
          <div className="hero-stat"><strong>{employees.length}</strong><span>Total employees</span></div>
        </section>

        {error && <div className="alert">{error}</div>}

        <section className="panel form-panel">
          <div className="panel-title">
            <div><UserPlus size={20}/><h2>{editingId ? "Edit Employee" : "Add Employee"}</h2></div>
            {editingId && <button className="ghost" onClick={cancel}><X size={16}/> Cancel</button>}
          </div>
          <form onSubmit={submit} className="form-grid">
            {[
              ["name","Full name","e.g. Rahul Sharma"],
              ["email","Email","rahul@example.com"],
              ["role","Role","Software Developer"],
              ["department","Department","Engineering"],
              ["salary","Salary (₹)","50000"]
            ].map(([key,label,placeholder]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  type={key === "salary" ? "number" : key === "email" ? "email" : "text"}
                  value={form[key]}
                  placeholder={placeholder}
                  onChange={e => setForm({...form, [key]: e.target.value})}
                />
              </label>
            ))}
            <button className="primary" type="submit">{editingId ? "Update Employee" : "Add Employee"}</button>
          </form>
        </section>

        <section className="panel">
          <div className="list-head">
            <div><p className="eyebrow">DIRECTORY</p><h2>Employee Records</h2></div>
            <div className="search"><Search size={18}/><input placeholder="Search employees..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>

          {loading ? <div className="empty">Loading employees...</div> :
           filtered.length === 0 ? <div className="empty">No employees found. Add your first employee above.</div> :
           <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Role</th><th>Department</th><th>Salary</th><th>Actions</th></tr></thead>
           <tbody>{filtered.map(e => <tr key={e._id}>
             <td><div className="person"><div className="avatar">{e.name[0].toUpperCase()}</div><div><b>{e.name}</b><small>{e.email}</small></div></div></td>
             <td>{e.role}</td><td><span className="tag">{e.department}</span></td>
             <td>₹{Number(e.salary).toLocaleString("en-IN")}</td>
             <td><div className="actions"><button onClick={()=>edit(e)} title="Edit"><Pencil size={17}/></button><button onClick={()=>remove(e._id)} title="Delete"><Trash2 size={17}/></button></div></td>
           </tr>)}</tbody></table></div>}
        </section>
      </main>
      <footer>Employee Management System • MERN Stack Project</footer>
    </div>
  );
}

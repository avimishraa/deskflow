import { useEffect, useState } from "react";
import API from "../api/ticketApi";
import TicketCard from "../components/TicketCard";
import CreateTicketForm from "../components/CreateTicketForm";
function BoardPage() {
const [tickets, setTickets] = useState([]);
const [priorityFilter, setPriorityFilter] =
useState("");
const [breachedOnly, setBreachedOnly] =
useState(false);
const [stats, setStats] = useState(null);
const [loading, setLoading] =
useState(false);
const fetchTickets = async () => {
try {
setLoading(true);
let query = "/tickets?";
if (priorityFilter) {
query += `priority=${priorityFilter}&`;
}
if (breachedOnly) {
query += "breached=true";
}
const response = await API.get(query);
setTickets(response.data.data);
} catch (error) {
console.log(error);
} finally {
setLoading(false);
}
};
const fetchStats = async () => {
try {
const response = await API.get(
"/tickets/stats"
);
setStats(response.data.data);
} catch (error) {
console.log(error);
}
};
useEffect(() => {
fetchTickets();
fetchStats();
}, [priorityFilter, breachedOnly]);
const openTickets = tickets.filter(
(ticket) => ticket.status === "open"
);
const inProgressTickets = tickets.filter(
(ticket) =>
ticket.status === "in_progress"
);
const resolvedTickets = tickets.filter(
(ticket) => ticket.status === "resolved"
);
const closedTickets = tickets.filter(
(ticket) => ticket.status === "closed"
);
const columns = [
{
title: "Open",
data: openTickets,
bg: "#dbeafe"
},
{
title: "In Progress",
data: inProgressTickets,
bg: "#fef3c7"
},
{
title: "Resolved",
data: resolvedTickets,
bg: "#dcfce7"
},
{
title: "Closed",
data: closedTickets,
bg: "#e5e7eb"
}
];
return (
<div
style={{
minHeight: "100vh",
background:
"linear-gradient(to right, #eef2ff, #f8fafc)",
padding: "25px"
}}
>
<div
style={{
maxWidth: "1600px",
margin: "auto"
}}
>
<div
style={{
display: "flex",
justifyContent:
"space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "20px",
marginBottom: "25px"
}}
>
<div>
<h1
style={{
fontSize: "38px",
marginBottom: "6px",
color: "#111827"
}}
>
DeskFlow Support Board
</h1>
<p
style={{
color: "#6b7280"
}}
>
Manage customer support workflows efficiently.
</p>
</div>
<div
style={{
display: "flex",
gap: "14px",
flexWrap: "wrap"
}}
>
<select
value={priorityFilter}
onChange={(e) =>
setPriorityFilter(
e.target.value
)
}
style={{
padding: "12px",
borderRadius: "10px",
border:
"1px solid #d1d5db",
background: "white"
}}
>
<option value="">
All Priorities
</option>
<option value="low">
Low
</option>
<option value="medium">
Medium
</option>
<option value="high">
High
</option>
<option value="urgent">
Urgent
</option>
</select>
<label
style={{
background: "white",
padding:
"12px 18px",
borderRadius: "10px",
display: "flex",
alignItems: "center",
gap: "10px",
border:
"1px solid #d1d5db"
}}
>
<input
type="checkbox"
checked={breachedOnly}
onChange={(e) =>
setBreachedOnly(
e.target.checked
)
}
/>
SLA Breached Only
</label>
</div>
</div>
<CreateTicketForm
fetchTickets={fetchTickets}
/>
{stats && (
<div
style={{
display: "grid",
gridTemplateColumns:
"repeat(auto-fit, minmax(180px, 1fr))",
gap: "16px",
marginBottom: "30px"
}}
>
{[
{
label: "Open",
value:
stats.statusCounts.open,
color: "#2563eb"
},
{
label: "In Progress",
value:
stats.statusCounts
.in_progress,
color: "#d97706"
},
{
label: "Resolved",
value:
stats.statusCounts
.resolved,
color: "#16a34a"
},
{
label: "Closed",
value:
stats.statusCounts
.closed,
color: "#6b7280"
},
{
label: "Breached",
value:
stats.breachedOpenTickets,
color: "#dc2626"
}
].map((item) => (
<div
key={item.label}
style={{
background: "white",
padding: "20px",
borderRadius: "16px",
boxShadow:
"0 4px 10px rgba(0,0,0,0.06)"
}}
>
<h3
style={{
color: item.color,
marginBottom: "8px"
}}
>
{item.label}
</h3>
<h1
style={{
fontSize: "32px",
margin: 0
}}
>
{item.value}
</h1>
</div>
))}
</div>
)}
{loading && (
<h2>Loading tickets...</h2>
)}
<div
style={{
display: "grid",
gridTemplateColumns:
"repeat(auto-fit, minmax(300px, 1fr))",
gap: "20px"
}}
>
{columns.map((column) => (
<div
key={column.title}
style={{
background: column.bg,
borderRadius: "18px",
padding: "18px",
minHeight: "500px"
}}
>
<div
style={{
display: "flex",
justifyContent:
"space-between",
alignItems: "center",
marginBottom: "20px"
}}
>
<h2>{column.title}</h2>
<span
style={{
background: "white",
padding:
"6px 12px",
borderRadius: "20px",
fontWeight: "bold"
}}
>
{column.data.length}
</span>
</div>
{column.data.length === 0 && (
<p
style={{
color: "#6b7280"
}}
>
No tickets available.
</p>
)}
{column.data.map((ticket) => (
<TicketCard
key={ticket._id}
ticket={ticket}
fetchTickets={fetchTickets}
/>
))}
</div>
))}
</div>
</div>
</div>
);
}
export default BoardPage;
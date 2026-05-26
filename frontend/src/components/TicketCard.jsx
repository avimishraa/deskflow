import toast from "react-hot-toast";
import API from "../api/ticketApi";
import { formatAge } from "../utils/formatAge";
function TicketCard({
ticket,
fetchTickets
}) {
const priorityColors = {
low: "#16a34a",
medium: "#d97706",
high: "#dc2626",
urgent: "#7f1d1d"
};
const updateStatus = async (
newStatus
) => {
try {
await API.patch(
`/tickets/${ticket._id}`,
{
status: newStatus
}
);
toast.success("Status updated");
fetchTickets();
} catch (error) {
toast.error(
error.response?.data?.message ||
"Update failed"
);
}
};
const deleteTicket = async () => {
try {
await API.delete(
`/tickets/${ticket._id}`
);
toast.success("Ticket deleted");
fetchTickets();
} catch (error) {
toast.error("Delete failed");
}
};
const buttonStyle = {
padding: "8px 14px",
border: "none",
borderRadius: "8px",
cursor: "pointer",
fontWeight: "600"
};
return (
<div
style={{
background: "white",
borderRadius: "16px",
padding: "18px",
marginBottom: "16px",
boxShadow:
"0 4px 12px rgba(0,0,0,0.08)",
transition: "0.2s"
}}
>
<div
style={{
display: "flex",
justifyContent:
"space-between",
alignItems: "start",
gap: "10px"
}}
>
<h3
style={{
marginTop: 0,
color: "#111827"
}}
>
{ticket.subject}
</h3>
<span
style={{
background:
priorityColors[
ticket.priority
],
color: "white",
padding: "6px 10px",
borderRadius: "20px",
fontSize: "12px",
textTransform: "capitalize"
}}
>
{ticket.priority}
</span>
</div>
<p
style={{
color: "#4b5563",
lineHeight: "1.5"
}}
>
{ticket.description}
</p>
<div
style={{
marginTop: "12px",
fontSize: "14px",
color: "#374151"
}}
>
<p>
<strong>Email:</strong>{" "}
{ticket.customerEmail}
</p>
<p>
<strong>Age:</strong>{" "}
{formatAge(
ticket.ageMinutes
)}
</p>
</div>
<div
style={{
marginTop: "10px"
}}
>
<span
style={{
background:
ticket.slaBreached
? "#fee2e2"
: "#dcfce7",
color:
ticket.slaBreached
? "#b91c1c"
: "#166534",
padding: "6px 12px",
borderRadius: "20px",
fontSize: "13px",
fontWeight: "bold"
}}
>
{ticket.slaBreached
? "SLA Breached"
: "SLA Healthy"}
</span>
</div>
<div
style={{
display: "flex",
flexWrap: "wrap",
gap: "10px",
marginTop: "18px"
}}
>
{ticket.status === "open" && (
<button
onClick={() =>
updateStatus(
"in_progress"
)
}
style={{
...buttonStyle,
background: "#2563eb",
color: "white"
}}
>
Start
</button>
)}
{ticket.status ===
"in_progress" && (
<>
<button
onClick={() =>
updateStatus("open")
}
style={{
...buttonStyle,
background: "#f3f4f6"
}}
>
Reopen
</button>
<button
onClick={() =>
updateStatus(
"resolved"
)
}
style={{
...buttonStyle,
background: "#16a34a",
color: "white"
}}
>
Resolve
</button>
</>
)}
{ticket.status ===
"resolved" && (
<>
<button
onClick={() =>
updateStatus(
"in_progress"
)
}
style={{
...buttonStyle,
background: "#f3f4f6"
}}
>
Reopen
</button>
<button
onClick={() =>
updateStatus(
"closed"
)
}
style={{
...buttonStyle,
background: "#6b7280",
color: "white"
}}
>
Close
</button>
</>
)}
{ticket.status === "closed" && (
<button
onClick={() =>
updateStatus(
"resolved"
)
}
style={{
...buttonStyle,
background: "#f3f4f6"
}}
>
Reopen
</button>
)}
</div>
<button
onClick={deleteTicket}
style={{
marginTop: "16px",
width: "100%",
background: "#dc2626",
color: "white",
border: "none",
padding: "10px",
borderRadius: "10px",
cursor: "pointer",
fontWeight: "bold"
}}
>
Delete Ticket
</button>
</div>
);
}
export default TicketCard;
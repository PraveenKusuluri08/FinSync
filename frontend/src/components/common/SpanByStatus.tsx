import React from "react";

interface StatusBadgeProps {
  status: "settled" | "reimbursed" | "pending";
}

const statusClasses: Record<StatusBadgeProps["status"], string> = {
  settled: "bg-green-100 text-green-800 border-green-400",
  reimbursed: "bg-gray-100 text-gray-800 border-gray-400",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 text-sm font-medium border rounded-full ${statusClasses[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;

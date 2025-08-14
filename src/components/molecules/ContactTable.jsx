import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatDate } from "@/utils/formatters";

const ContactTable = ({ contacts, onEdit, onDelete, onCreateDeal }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Phone</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Lead Source</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr 
              key={contact.Id} 
              className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="py-4 px-4">
                <div className="font-medium text-gray-900">{contact.name}</div>
              </td>
              <td className="py-4 px-4 text-gray-700">{contact.company}</td>
              <td className="py-4 px-4 text-gray-700">{contact.email}</td>
              <td className="py-4 px-4 text-gray-700">{contact.phone}</td>
              <td className="py-4 px-4">
                <Badge variant="primary" size="sm">
                  {contact.leadSource}
                </Badge>
              </td>
              <td className="py-4 px-4 text-gray-600 text-sm">
                {formatDate(contact.createdAt)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="Plus"
                    onClick={() => onCreateDeal && onCreateDeal(contact)}
                    className="text-xs"
                  >
                    Deal
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="Edit"
                    onClick={() => onEdit && onEdit(contact)}
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="Trash2"
                    onClick={() => onDelete && onDelete(contact)}
                    className="text-xs text-red-600 hover:text-red-700"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
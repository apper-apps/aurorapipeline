import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/utils/formatters";

const ContactTable = ({ contacts, onEdit, onDelete, onCreateDeal }) => {
  return (
    <div className="overflow-x-auto">
<table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">NAME</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">COMPANY</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">EMAIL</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">PHONE</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">LEAD SOURCE</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">CREATED</th>
            <th className="text-left py-4 px-4 font-semibold text-sm text-slate-700">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <motion.tr 
              key={contact.Id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.8)" }}
              className={`border-b border-slate-200 transition-colors duration-200 cursor-pointer ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <td className="py-4 px-4">
                <motion.div 
                  className="font-semibold text-gray-900 text-base"
                  whileHover={{ scale: 1.02 }}
                >
{contact.Name}
                </motion.div>
              </td>
<td className="py-4 px-4 font-medium text-gray-800">{contact.company_c}</td>
              <td className="py-4 px-4 font-medium text-slate-600">{contact.email_c}</td>
              <td className="py-4 px-4 font-medium text-slate-600">{contact.phone_c}</td>
              <td className="py-4 px-4">
                <Badge variant="primary" size="sm">
{contact.lead_source_c}
                </Badge>
              </td>
              <td className="py-4 px-4 text-gray-700 text-sm font-medium">
{formatDate(contact.created_at_c)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Plus"
                      onClick={() => onCreateDeal && onCreateDeal(contact)}
                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 border-0 shadow-sm"
                    >
                      Deal
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => onEdit && onEdit(contact)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => onDelete && onDelete(contact)}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 border-0"
                    />
                  </motion.div>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
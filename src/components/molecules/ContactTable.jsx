import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { formatDate } from "@/utils/formatters";

const ContactTable = ({ contacts, onEdit, onDelete, onCreateDeal }) => {
  return (
    <div className="overflow-x-auto">
<table className="w-full">
        <thead className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white">
          <tr>
            <th className="text-left py-4 px-4 font-black text-sm">👤 NAME</th>
            <th className="text-left py-4 px-4 font-black text-sm">🏢 COMPANY</th>
            <th className="text-left py-4 px-4 font-black text-sm">📧 EMAIL</th>
            <th className="text-left py-4 px-4 font-black text-sm">📞 PHONE</th>
            <th className="text-left py-4 px-4 font-black text-sm">🌟 LEAD SOURCE</th>
            <th className="text-left py-4 px-4 font-black text-sm">📅 CREATED</th>
            <th className="text-left py-4 px-4 font-black text-sm">⚡ ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <motion.tr 
              key={contact.Id} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.01,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
              }}
              className={`border-b-2 border-gradient-to-r from-blue-100 to-purple-100 transition-all duration-300 cursor-pointer ${
                index % 2 === 0 ? 'bg-white/80' : 'bg-gradient-to-r from-blue-50/50 to-purple-50/50'
              }`}
            >
              <td className="py-4 px-4">
                <motion.div 
                  className="font-black text-gray-900 text-base"
                  whileHover={{ scale: 1.05 }}
                >
                  {contact.name}
                </motion.div>
              </td>
              <td className="py-4 px-4 font-bold text-gray-800">{contact.company}</td>
              <td className="py-4 px-4 font-semibold text-blue-600">{contact.email}</td>
              <td className="py-4 px-4 font-medium text-purple-600">{contact.phone}</td>
              <td className="py-4 px-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                >
                  <Badge 
                    variant="primary" 
                    size="sm"
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-0 shadow-md font-bold"
                  >
                    ⭐ {contact.leadSource}
                  </Badge>
                </motion.div>
              </td>
              <td className="py-4 px-4 text-gray-700 text-sm font-semibold">
                📅 {formatDate(contact.createdAt)}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Plus"
                      onClick={() => onCreateDeal && onCreateDeal(contact)}
                      className="text-xs bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0 shadow-md font-bold"
                    >
                      💼 Deal
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Edit"
                      onClick={() => onEdit && onEdit(contact)}
                      className="text-xs bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white border-0 shadow-md"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="Trash2"
                      onClick={() => onDelete && onDelete(contact)}
                      className="text-xs bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white border-0 shadow-md"
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
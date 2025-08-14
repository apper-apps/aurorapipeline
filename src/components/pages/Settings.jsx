import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Customize your Pipeline Pro experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Configuration */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg">
              <ApperIcon name="Settings" className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900">Pipeline Configuration</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Pipeline Name"
              placeholder="Sales Pipeline"
              defaultValue="Sales Pipeline"
            />
            
            <Select
              label="Default Priority"
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
              defaultValue="medium"
            />

            <Input
              label="Stage Duration Warning (days)"
              type="number"
              placeholder="30"
              defaultValue="30"
            />

            <Button variant="primary" className="w-full">
              Save Pipeline Settings
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <ApperIcon name="Bell" className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email alerts for important events</p>
              </div>
              <Button variant="ghost" icon="Toggle" className="text-primary-600">
                On
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Deal Reminders</p>
                <p className="text-sm text-gray-600">Get reminded about stale deals</p>
              </div>
              <Button variant="ghost" icon="Toggle" className="text-primary-600">
                On
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
              </div>
              <Button variant="ghost" icon="Toggle" className="text-gray-400">
                Off
              </Button>
            </div>

            <Button variant="primary" className="w-full">
              Save Notification Settings
            </Button>
          </div>
        </Card>

        {/* Integration Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
              <ApperIcon name="Link" className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900">Integrations</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Mail" className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email Integration</p>
                  <p className="text-sm text-gray-600">Connect your email account</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Connect
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Calendar Sync</p>
                  <p className="text-sm text-gray-600">Sync with Google Calendar</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Connect
              </Button>
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
              <ApperIcon name="Database" className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900">Data Management</h3>
          </div>

          <div className="space-y-4">
            <Button variant="secondary" icon="Download" className="w-full">
              Export All Data
            </Button>
            
            <Button variant="secondary" icon="Upload" className="w-full">
              Import Contacts
            </Button>
            
            <Button variant="danger" icon="Trash2" className="w-full">
              Clear All Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
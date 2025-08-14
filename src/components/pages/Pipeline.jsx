import React from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";

const Pipeline = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">Track and manage your deals through the sales process</p>
        </div>
      </div>
      
      <div className="h-[calc(100vh-12rem)]">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;
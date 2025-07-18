import { ChevronDown, ChevronRight, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

const AttributeCard = ({
  attribute,
  onDelete,
  onAddValue,
  newValue,
  setNewValue,
  isCreatingValue,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddValue = () => {
    onAddValue(attribute.id);
    setShowAddForm(false);
  };

  const handleDeleteValue = (valueId) => {
    if (confirm("Are you sure you want to delete this value?")) {
      console.log("Deleting value:", valueId, "from attribute:", attribute.id);
      // Implementation for deleting value
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{attribute.name}</h3>
            </div>

            {/* Categories */}
            <div className="space-y-1">
              {(attribute.categories || []).map((catRel) => (
                <div key={catRel.id} className="flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {catRel.category?.name || "Unknown Category"}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      catRel.isRequired
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {catRel.isRequired ? "Required" : "Optional"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            <button
              onClick={() => onDelete(attribute.id)}
              className="p-1 hover:bg-red-100 text-red-600 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Values ({attribute.values?.length || 0})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Values Display */}
        {isExpanded && (
          <div className="space-y-2 mb-3">
            {(attribute.values || []).length > 0 ? (
              attribute.values.map((value) => (
                <div
                  key={value.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                >
                  <span className="text-sm text-gray-700">{value.value}</span>
                  <button
                    onClick={() => handleDeleteValue(value.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">
                No values added yet
              </p>
            )}
          </div>
        )}

        {/* Quick Preview of Values */}
        {!isExpanded && attribute.values?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {attribute.values.slice(0, 3).map((value) => (
              <span
                key={value.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {value.value}
              </span>
            ))}
            {attribute.values.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{attribute.values.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Add Value Form */}
        {showAddForm && (
          <div className="border-t pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newValue[attribute.id] || ""}
                onChange={(e) =>
                  setNewValue((prev) => ({
                    ...prev,
                    [attribute.id]: e.target.value,
                  }))
                }
                placeholder="Enter value..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleAddValue}
                disabled={isCreatingValue || !newValue[attribute.id]?.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttributeCard;

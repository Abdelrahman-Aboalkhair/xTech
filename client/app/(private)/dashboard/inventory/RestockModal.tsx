'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { X } from 'lucide-react';
import { GET_ALL_PRODUCTS } from '@/app/gql/Product';

interface AdjustStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { productId: string; quantity: number; reason: string }) => void;
    isLoading: boolean;
    initialProductId?: string | null;
}

const AdjustStockModal = ({ isOpen, onClose, onSubmit, isLoading, initialProductId }: AdjustStockModalProps) => {
    const { data: productsData } = useQuery(GET_ALL_PRODUCTS, {
        variables: { first: 100, skip: 0 }, // Adjust as needed
    });
    const products = productsData?.products?.products || [];
    const [formData, setFormData] = useState({
        productId: initialProductId || '',
        quantity: 0,
        reason: '',
    });

    useEffect(() => {
        if (initialProductId) {
            setFormData((prev) => ({ ...prev, productId: initialProductId }));
        }
    }, [initialProductId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Adjust Stock</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <select
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="w-full border rounded-md p-2 mt-1"
                            disabled={!!initialProductId}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map((product: any) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Quantity Change</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                            className="w-full border rounded-md p-2 mt-1"
                            required
                            placeholder="Positive to add, negative to subtract"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full border rounded-md p-2 mt-1"
                            required
                            placeholder="e.g., Damaged items removed"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !formData.productId || !formData.reason}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Adjusting...' : 'Adjust'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdjustStockModal;
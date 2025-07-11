'use client'

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TagsIcon, Box } from 'lucide-react';
import useToast from '@/app/hooks/ui/useToast';
import Dropdown from '@/app/components/molecules/Dropdown';
import { useGetAllCategoriesQuery } from '@/app/store/apis/CategoryApi';
import { useGetAllProductsQuery } from '@/app/store/apis/ProductApi';
import { useAssignAttributeToCategoryMutation, useAssignAttributeToProductMutation } from '@/app/store/apis/AttributeApi';

interface Attribute {
  id: string;
  name: string;
}

interface AssignFormData {
  attributeId: string;
  categoryId: string;
  productId: string;
  isRequired: boolean;
}

interface AttributeAssignmentProps {
  attributes: Attribute[];
}

const AttributeAssignment: React.FC<AttributeAssignmentProps> = ({ attributes }) => {
  console.log('attributes => ', attributes)
  const { showToast } = useToast();
  const { control, handleSubmit, reset, watch, setValue } = useForm<AssignFormData>({
    defaultValues: {
      attributeId: '',
      categoryId: '',
      productId: '',
      isRequired: false,
    },
  });

  const { data: categoriesData } = useGetAllCategoriesQuery(undefined)

  const { data: productsData } = useGetAllProductsQuery(undefined)
  console.log('productsData => ', productsData)

  // Mutations
  const [assignAttributeToCategory, { isLoading: isAssigningToCategory }] = useAssignAttributeToCategoryMutation()
  const [assignAttributeToProduct, { isLoading: isAssigningToProduct }] = useAssignAttributeToProductMutation()

  // Dropdown options
  const attributeOptions = attributes?.map((attr) => ({
    label: attr?.name,
    value: attr?.id,
  }));

  const categoryOptions = categoriesData?.categories?.map((cat: any) => ({
    label: cat.name,
    value: cat.id,
  })) || [];

  const productOptions = productsData?.products?.map((prod: any) => ({
    label: prod.name,
    value: prod.id,
  })) || [];
  console.log('productsOptions => ', productOptions)

  // Handle category assignment
  const onAssignToCategory = async (data: AssignFormData) => {
    if (!data.attributeId || !data.categoryId) {
      showToast('Please select an attribute and category', 'error');
      return;
    }
    try {
      await assignAttributeToCategory({
        categoryId: data.categoryId,
        attributeId: data.attributeId,
        isRequired: data.isRequired,

      });
      showToast('Attribute assigned to category', 'success');
      reset({ attributeId: '', categoryId: '', isRequired: false });
    } catch (err) {
      console.error('Error assigning to category:', err);
      showToast('Failed to assign attribute to category', 'error');
    }
  };

  // Handle product assignment
  const onAssignToProduct = async (data: AssignFormData) => {
    if (!data.attributeId || !data.productId) {
      showToast('Please select an attribute and product', 'error');
      return;
    }
    try {
      await assignAttributeToProduct({
        attributeId: data.attributeId,
        productId: data.productId,
      });
      showToast('Attribute assigned to product', 'success');
      reset({ attributeId: '', productId: '' });
    } catch (err) {
      console.error('Error assigning to product:', err);
      showToast('Failed to assign attribute to product', 'error');
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Assign Attributes</h2>
      <div className="space-y-6">
        {/* Attribute Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Attribute</label>
          <Controller
            name="attributeId"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={attributeOptions || []}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue('categoryId', '');
                  setValue('productId', '');
                }}
              />
            )}
          />
        </div>

        {/* Category Assignment */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <TagsIcon size={16} className="text-primary" />
            <h3 className="text-md font-medium">Assign to Category</h3>
          </div>
          <form onSubmit={handleSubmit(onAssignToCategory)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={categoryOptions || []}
                    value={field.value}
                    onChange={field.onChange}
                    label="Select category"
                  />
                )}
              />
            </div>
            <div className="flex items-center">
              <Controller
                name="isRequired"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                )}
              />
              <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
                Required attribute
              </label>
            </div>
            <button
              type="submit"
              disabled={isAssigningToCategory || !watch('attributeId') || !watch('categoryId')}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigningToCategory ? 'Assigning...' : 'Assign to Category'}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
};

export default AttributeAssignment;
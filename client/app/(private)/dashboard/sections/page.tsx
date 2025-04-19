"use client";
import Dropdown from "@/app/components/molecules/Dropdown";
import {
  useCreateSectionMutation,
  useGetAllSectionsQuery,
} from "@/app/store/apis/SectionApi";
import { Controller, useForm } from "react-hook-form";
import ImageUploader from "@/app/components/molecules/ImageUploader";

type sectionType = "HERO" | "PROMOTIONAL" | "BENEFITS" | "NEW_ARRIVALS";

export interface Section {
  id: number;
  type: sectionType;
  title?: string;
  description?: string;
  images?: string;
  icons?: string;
  link?: string;
  ctaText: string;
  isVisible?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

const SectionsDashboard = () => {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      ctaText: "",
      type: "",
    },
  });
  const { data, error } = useGetAllSectionsQuery(undefined);
  const [createSection, { error: createSectionError, isLoading }] =
    useCreateSectionMutation();
  console.log("Sections data =>  ", data);

  const handleCreateSection = async (data: any) => {
    console.log("data being submitted => ", data);
    try {
      await createSection(data).unwrap();
    } catch (error: any) {
      console.log("error creating section: ", error);
    }
  };

  console.log("error =>  ", error);
  console.log("create section error =>  ", createSectionError);
  return (
    <main className="p-6 gap-4">
      <h1 className="text-2xl mb-6">Create new section</h1>
      <form
        onSubmit={handleSubmit(handleCreateSection)}
        className="flex flex-col items-start justify-start gap-4 w-[50%]"
      >
        <ImageUploader
          label={"Section Images"}
          control={control}
          errors={errors}
          setValue={setValue}
          watch={watch}
        />
        <input
          placeholder="50% off all our products, BLACK FRIDAY!"
          {...register("title")}
          className="border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 p-3 rounded-lg w-full"
        />
        <input
          placeholder="This is the description of the section"
          className="border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 p-3 rounded-lg w-full"
          {...register("description")}
        />
        <input
          placeholder="Explore now!"
          className="border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 p-3 rounded-lg"
          {...register("ctaText")}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Dropdown
              onChange={field.onChange}
              options={[{ label: "HERO", value: "HERO" }]}
              value={field.value}
              label="Section Type"
              className="min-w-[230px]"
            />
          )}
        />
        <button
          type="submit"
          className={`${
            isLoading ? "bg-gray-300 text-black" : "bg-indigo-600 text-white"
          } p-3 px-8 capitalize rounded text-[15px] font-semibold`}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create section"}
        </button>
      </form>
    </main>
  );
};

export default SectionsDashboard;

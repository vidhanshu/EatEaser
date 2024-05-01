import { useMutation } from "@tanstack/react-query";
import React from "react";
import axiosInstance from "../utils/axios";
import { ROUTES } from "../utils/api-routes";
import { AxiosError } from "axios";
import { toast } from "@ui/components";

const useFile = ({ onUploadSuccess, path }: { onUploadSuccess?: (url: string) => void; path: string }) => {
  const [percentage, setPercentage] = React.useState(0);

  const {
    mutate: uploadFile,
    isPending: isUploading,
    data,
  } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return (
        await axiosInstance.post(`${ROUTES.file.upload}?path=${path}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress(progressEvent) {
            if (!progressEvent.total) return;

            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

            setPercentage(percentCompleted);
          },
        })
      ).data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      }
      setPercentage(0);
    },
    onSuccess: ({ data }) => {
      onUploadSuccess?.(data.url);
      setPercentage(0);
    },
  });

  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: async (url: string) => {
      // i want everything at the end except the domain
      // the url wd be like this: https://<bucket_name>.<region>.amazonaws.com/<folder...>/something.png
      // i want <folder...>/something.png
      const urlParts = url.split("/");
      const key = urlParts.slice(3).join("/");
      (
        await axiosInstance.delete(ROUTES.file.delete, {
          data: { key },
        })
      ).data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "Something went wrong");
      }
    },
  });

  return {
    uploadFile,
    deleteFile,
    url: data?.url ?? null,
    isUploading,
    isDeleting,
    percentage,
  };
};

export default useFile;

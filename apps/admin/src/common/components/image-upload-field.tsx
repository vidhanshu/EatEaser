import { useRef, useState } from "react";
import { Pencil, UploadCloud, X } from "lucide-react";

import useFile from "@src/common/hooks/use-file";
import { isS3Url } from "@src/common/utils/helpers";
import ImgWithPlaceholder from "./img-with-placeholder";
import { Button, Progress, toast } from "@ui/components";
import { getInitials } from "@src/restaurant/utils/helpers";
import { cn } from "@ui/lib/utils";

const ImageUploadField = ({
  image,
  name,
  onUploadSuccess,
  path = "restaurant/",
  imgFileState,
  disabled,
  imgWithPlaceholderProps = {},
}: {
  image?: string;
  name?: string;
  onUploadSuccess?: (url: string) => void;
  path?: string;
  imgFileState?: {
    pImgFile: File | null;
    pSetImgFile: (file: File | null) => void;
  };
  disabled?: boolean;
  imgWithPlaceholderProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}) => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const imgToConsider = imgFileState?.pImgFile ?? imgFile;
  const setImgToConsider = imgFileState?.pSetImgFile ?? setImgFile;
  const { uploadFile, isUploading, deleteFile, percentage } = useFile({
    path,
    onUploadSuccess: (url) => {
      setImgToConsider(null);
      onUploadSuccess?.(url);
    },
  });

  const handleFileUpload = () => {
    // upload image if exists
    if (imgToConsider) {
      uploadFile(imgToConsider);
      //   delete previous image if exists
      if (image && isS3Url(image)) {
        deleteFile(image);
      }
    }
  };

  const handleReset = () => {
    if (inputFile.current) {
      inputFile.current.value = "";
      inputFile.current.type = "text";
      inputFile.current.type = "file";
    }
  };

  return (
    <div className="relative w-fit">
      <div className="w-[160px] h-[160px] overflow-hidden rounded-md">
        <label
          className={cn("cursor-pointer", disabled ? "cursor-auto" : "")}
          htmlFor="avatar_profile"
        >
          <div className="group w-[160px] h-[160px] relative rounded-md">
            <ImgWithPlaceholder
              src={
                imgToConsider
                  ? URL.createObjectURL(imgToConsider)
                  : image
                    ? image
                    : ""
              }
              placeholder={getInitials(name ?? "")}
              {...imgWithPlaceholderProps}
            />
            {!disabled && (
              <div className="inset-0 transition-colors group-hover:bg-black/40 w-full h-full rounded-md absolute flex justify-center items-center">
                <Pencil className="w-5 h-5 hidden group-hover:block text-white" />
              </div>
            )}
          </div>
          <div />
        </label>
      </div>
      {imgToConsider && (
        <Button
          onClick={() => {
            setImgToConsider(null);
            handleReset();
          }}
          className="absolute -top-4 -right-4"
          variant="destructive"
          size="icon-sm"
          startContent={<X size={16} />}
        />
      )}
      {isUploading && (
        <Progress
          className="bg-gray-300 mt-2 h-[10px] w-[160px] dark:bg-gray-800"
          value={percentage}
        />
      )}
      {imgToConsider && (
        <Button
          type="button"
          onClick={handleFileUpload}
          loading={isUploading}
          className="mt-2 w-[160px] bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
          startContent={<UploadCloud size={16} />}
        >
          Upload
        </Button>
      )}
      <input
        disabled={disabled || isUploading}
        ref={inputFile}
        accept="image/jpeg, image/png, image/jpg"
        id="avatar_profile"
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            if (e.target.files[0].size / 1e6 > 5) {
              toast.error("File size should be less than 1MB");
              return;
            }
            setImgToConsider(e.target.files[0]);
          }
        }}
      />
    </div>
  );
};

export default ImageUploadField;

/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Button from '@/app/components/Button';
import Heading from '@/app/components/Heading';
import CategoryInput from '@/app/inputs/CategoryInput';
import CustonCheckBox from '@/app/inputs/CustonCheckBox';
import SelectColor from '@/app/inputs/SelectColor';
import TextArea from '@/app/inputs/TextArea';
import Input from '@/app/inputs/input';
import firebaseApp from '@/libs/firebase';
import { categories } from '@/utils/Categories';
import { colors } from '@/utils/Colors';
import { data } from 'autoprefixer';

import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export type ImageType = {
  color: string;
  colorCode: string | null;
  image: File | null;
};
export type UploadedImageType = {
  color: string;
  colorCode: string | null;
  image: string;
};

const AddProductForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageType[] | null>();
  const [isProductCreated, setIsProductCreated] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      brand: '',
      category: '',
      inStock: false,
      images: [],
      price: '',
    },
  });

  console.log('images', images);

  useEffect(() => {
    setCustomValue('images', images);
  }, [images]);

  useEffect(() => {
    if (isProductCreated) {
      reset();
      setImages(null);
      setIsProductCreated(false);
    }
  }, [isProductCreated]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('data', data);
    // upload images to fb
    setIsLoading(true);
    let uploadedImages: UploadedImageType[] = [];

    if (!data.category) {
      setIsLoading(false);
      return toast.error('Category is not selected');
    }

    if (!data.images || data.images.length === 0) {
      setIsLoading(false);
      return toast.error('no selected images');
    }

    const handleImageUploads = async () => {
      toast('Creating product,please wait...');
      try {
        for (const item of data.images) {
          if (item.image) {
            const fileName = new Date().getTime() + '-' + item.image.name; // this for unique image name
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `products/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item.image);

            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;
                  }
                },
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error);
                },
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      uploadedImages.push({
                        ...item,
                        image: downloadURL,
                      });
                      console.log('File available at', downloadURL);
                      resolve();
                    })
                    .catch((error) => {
                      console.log('Error getting the download URL', error);
                      reject(error);
                    });
                }
              );
            });
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.log('Error handling image uploads', error);
        return toast.error('Error handling image uploads');
      }
    };

    await handleImageUploads();
    const productData = { ...data, images: uploadedImages };
    console.log('productData', productData);

    //save product to mongodb
    axios
      .post('/api/product', productData)
      .then(() => {
        toast.success('Product created');
        setIsProductCreated(true);
        router.refresh();
      })
      .catch((error) => {
        toast.error('Something went wrong when saving product to db');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const category = watch('category');

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const addImageToState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (!prev) {
        return [value];
      }
      return [...prev, value];
    });
  }, []);
  const removeImageFromState = useCallback((value: ImageType) => {
    setImages((prev) => {
      if (prev) {
        const filteredImages = prev.filter((item) => item.color !== value.color);
        return filteredImages;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <Heading title="Add a Product" center />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="price"
        label="Price"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="number"
      />
      <Input
        id="brand"
        label="Brand"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <TextArea
        id="description"
        label="Description"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustonCheckBox id="inStock" register={register} label="This product in Stock" />
      <div className="w-full font-medium">
        <div className="mb-2 font-semibold">Select a category</div>
        <div className="grid grid-cols-2 md:grid-cols-3 max-h-[50vh] gap-1 overflow-y-auto">
          {categories.map((item) => {
            if (item.label === 'All') {
              return null;
            }
            return (
              <div key={item.label}>
                <CategoryInput
                  onClick={(category) => setCustomValue('category', category)}
                  selected={category === item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full flex flex-col flex-wrap gap-4">
        <div>
          <div className="font-bold">
            Select the available product colors and uplaod thier images
          </div>
          <div className="text-sm">
            You must uplaod an image for each of the color selected otherwise your color selection
            will be ignored
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 ">
          {colors.map((item, index) => {
            return (
              <>
                <SelectColor
                  key={index}
                  item={item}
                  addImageToState={addImageToState}
                  removeImageFromState={removeImageFromState}
                  isProductCreated={isProductCreated}
                />
              </>
            );
          })}
        </div>
      </div>
      <Button label={isLoading ? 'Loading....' : 'Add Product'} onClick={handleSubmit(onSubmit)} />
    </>
  );
};

export default AddProductForm;

import * as Yup from 'yup';
import { useState, useCallback, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui

import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, Typography } from '@mui/material';

// utils
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
} from '../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';

// root endpoint
import { API_ROOT } from 'src/config-global';




import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// ----------------------------------------------------------------------

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots',
];

// ----------------------------------------------------------------------

export default function BlogNewPostForm() {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [openPreview, setOpenPreview] = useState(false);

  // dùng cho loại đăng admin, user


  const getListKhachHangEndpoint = API_ROOT + '/auth/khachhang/getlist/'
  //API_ROOT + 'auth/khachhang/getlist/'
  const [KHS, setKHS] = useState([]);
  const [selectedType, setSelectedType] = useState(1);

  const getAllKhachHang = useCallback(async () => {
    try {
      const response = await axios.get(getListKhachHangEndpoint);
      setKHS(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllKhachHang()
  }, [getAllKhachHang]);
  

  const handleChange = (event) => {
    setSelectedType(event.target.value);
    console.log(selectedType)
  };

  //end

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    metaKeywords: Yup.array().min(1, 'Meta keywords is required'),
    cover: Yup.mixed().required('Cover is required'),
    content: Yup.string().required('Content is required'),
  });

  const defaultValues = {
    title: '',
    description: '',
    content: '',
    cover: null,
    tags: ['The Kid'],
    publish: true,
    comments: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      handleClosePreview();
      enqueueSnackbar('Post success!');
      push(PATH_DASHBOARD.blog.posts);
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('cover', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('cover', null);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Tiêu đề" />

              <RHFTextField name="description" label="Mô tả" multiline rows={3} />
              <RHFTextField name="content" label="Nội dung" multiline rows={3} />

         

              
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                

           
              </div>

              <div>
                <InputLabel id="demo-simple-select-label">Loại đăng</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedType}
                  onChange={handleChange}
                  label="Loại đăng">
                    <MenuItem key={1} value={1}>
                      ADMIN
                    </MenuItem>
                  {KHS.map((KH) => (
                    <MenuItem key={KH.idkh} value={KH.idkh}>
                      {KH.ho_ten} - {KH.phone_number}
                    </MenuItem>
                  ))}
                </Select>
              </div>



              <RHFTextField name="metaTitle" label="Meta title" />

              <RHFTextField
                name="metaDescription"
                label="Meta description"
                fullWidth
                multiline
                rows={3}
              />

              <RHFAutocomplete
                name="metaKeywords"
                label="Meta keywords"
                multiple
                freeSolo
                options={TAGS_OPTION.map((option) => option)}
                ChipProps={{ size: 'small' }}
              />
            </Stack>
          </Card>

          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
      

            <LoadingButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting}
            >
              Đăng bài
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>

      <BlogNewPostPreview
        values={values}
        open={openPreview}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
}

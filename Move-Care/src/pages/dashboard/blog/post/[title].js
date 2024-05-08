import { useEffect, useState, useCallback } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, Stack, Container, Typography, Pagination, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import axios from 'axios';
// layouts
import DashboardLayout from '../../../../layouts/dashboard';
// components
import Markdown from '../../../../components/markdown';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import { SkeletonPostDetails } from '../../../../components/skeleton';
// sections
import { BlogPostHero, BlogPostTags, BlogPostCard } from '../../../../sections/@dashboard/blog';

// config
import { nameApp, API_ROOT, linkIcon } from 'src/config-global';

// ----------------------------------------------------------------------

BlogPostPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function BlogPostPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { title },
  } = useRouter();
  const id = title;

  const API_GET_POST_DETAIL = API_ROOT + 'booking/post/detail/' + id + '/';
  const API_DUYET_BAi = API_ROOT + 'booking/post/approve/' + id + '/';
  const API_TU_CHOI = API_ROOT + 'booking/post/refuse/' + id + '/';



  

  const [post, setPost] = useState(null);

  const [loadingPost, setLoadingPost] = useState(true);

  const [errorMsg, setErrorMsg] = useState(null);

  const getPost = useCallback(async () => {
    try {
      const response = await axios.get(API_GET_POST_DETAIL);
      setPost(response.data.data);
      console.log(response.data);
      console.log(post);
      setLoadingPost(false);
    } catch (error) {
      console.error(error);
      setLoadingPost(false);
      setErrorMsg(error.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getPost();
    }
  }, [getPost, id]);

  console.log(post);

  const handleDuyet = async () => {
    try {
      const response = await axios.get(API_DUYET_BAi);
      setPost(response.data.data);
      console.log(response.data);
      console.log(post);
    } catch (error) {}
  };


  const handleTuChoi = async () => {
    try {
      const response = await axios.get(API_TU_CHOI);
      setPost(response.data.data);
      console.log(response.data);
      console.log(post);
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>{`Blog: ${post?.tieu_de || ''} | ${nameApp}`}</title>
        <link rel="icon" type="image/png" href={linkIcon} />
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Chi tiết bài thuê"
          links={[
            {
              name: 'Bảng điều khiển',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Bài thuê',
              href: PATH_DASHBOARD.blog.root,
            },
            {
              name: post?.tieu_de,
            },
          ]}
        />

        {post && (
          <Stack
            sx={{
              borderRadius: 2,
              boxShadow: (theme) => ({
                md: theme.customShadows.card,
              }),
            }}
          >
            <BlogPostHero post={post} />
            <Typography
              variant="h6"
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              {post.description}
            </Typography>
            description: {post.chi_tiet}
            <Markdown
              children={post.body}
              sx={{
                px: { md: 5 },
              }}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              <Typography variant="body1">Trạng thái:</Typography>
              <Stack
                variant="body1"
                sx={{
                  color: post.da_duyet ? '#4CAF50' : '#f44336',
                }}
                direction="row"
                alignItems="center"
              >
                <span>{post.da_duyet ? 'Đã được duyệt' : 'Chưa duyệt'}</span>
              </Stack>
            </Stack>
            <Stack
              spacing={3}
              sx={{
                py: 5,
                px: { md: 5 },
              }}
            >
              <Divider />
              <BlogPostTags post={post} />
              <Divider />
            </Stack>
            <Stack
              sx={{
                px: { md: 5 },
              }}
            >
              <Divider sx={{ mt: 5, mb: 2 }} />
            </Stack>
            <Stack
              direction="row" // Đảm bảo cả hai nút nằm trên cùng một hàng
              spacing={2} // Khoảng cách giữa các nút
              sx={{
                justifyContent: 'center', // Căn giữa các phần tử trong Stack
                px: { md: 5 },
                py: 2, // Khoảng cách lề trên và dưới
              }}
            >
              <Button onClick={handleDuyet} variant="contained" color="primary">
                Duyệt bài
              </Button>
              <Button onClick={handleTuChoi} variant="contained" color="error">
                Từ chối
              </Button>
            </Stack>
          </Stack>
        )}

        {errorMsg && !loadingPost && <Typography variant="h6">404 {errorMsg}</Typography>}

        {loadingPost && <SkeletonPostDetails />}
      </Container>
    </>
  );
}

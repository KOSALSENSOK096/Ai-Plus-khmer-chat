import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Container, Heading, Text, Button, Stack, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { NextPage } from 'next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home: NextPage = () => {
  const { t } = useTranslation('common');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={10}>
        {/* 导航栏 */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
          <Heading as="h1" size="xl">
            AI+
            <Text as="span" color="teal.500">
              ខ្មែរ
            </Text>
            CHAT
          </Heading>
          <Stack direction="row" spacing={4}>
            <LanguageSwitcher />
            <Button colorScheme="teal" variant="outline">
              {t('navbar.pricing')}
            </Button>
            <Button colorScheme="teal" variant="solid">
              {t('navbar.login')}
            </Button>
          </Stack>
        </Box>

        {/* 英雄区域 */}
        <Box textAlign="center" py={20}>
          <Heading as="h2" size="2xl" mb={4}>
            {t('homePage.hero.title')}
          </Heading>
          <Text fontSize="xl" mb={8}>
            {t('homePage.hero.subtitle')}
          </Text>
          <Stack direction="row" spacing={4} justify="center">
            <Button colorScheme="teal" size="lg">
              {t('homePage.hero.button.startChatting')}
            </Button>
            <Button colorScheme="teal" variant="outline" size="lg">
              {t('homePage.hero.button.viewPricing')}
            </Button>
          </Stack>
        </Box>

        {/* 功能特点 */}
        <Box py={20}>
          <Heading as="h3" size="xl" textAlign="center" mb={10}>
            {t('homePage.features.title')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {['bilingual', 'imageAnalysis', 'diagramGeneration', 'voiceInput'].map((feature) => (
              <Box
                key={feature}
                bg={cardBgColor}
                p={6}
                rounded="lg"
                shadow="md"
                _hover={{ transform: 'translateY(-5px)', transition: 'all 0.2s' }}
              >
                <Heading as="h4" size="md" mb={4}>
                  {t(`homePage.features.${feature}.title`)}
                </Heading>
                <Text>
                  {t(`homePage.features.${feature}.description`)}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* 创建者介绍 */}
        <Box py={20} textAlign="center">
          <Heading as="h3" size="xl" mb={4}>
            {t('homePage.meetTheCreator.title')}
          </Heading>
          <Text fontSize="xl" mb={4}>
            {t('homePage.meetTheCreator.name')}
          </Text>
          <Text>
            {t('homePage.meetTheCreator.bio')}
          </Text>
        </Box>

        {/* 页脚 */}
        <Box as="footer" py={10} textAlign="center">
          <Text>
            {t('footer.copyright')}
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default Home; 
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, Icon, Flex, Divider } from '@chakra-ui/react';
import { NextPage } from 'next';
import { FaCode, FaImage, FaFileAlt, FaMicrophone, FaShieldAlt, FaRobot, FaUserFriends } from 'react-icons/fa';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Home: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={10}>
        {/* Navbar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={10}>
          <Heading as="h1" size="xl" display="flex" alignItems="center" gap={2}>
            AI+
            <Text as="span" color="teal.500">
              ខ្មែរ
            </Text>
            CHAT
          </Heading>
          <Box display="flex" gap={4} alignItems="center">
            <LanguageSwitcher />
            <Button colorScheme="teal" variant="ghost">
              {t('navbar.pricing')}
            </Button>
            <Button colorScheme="teal" variant="outline">
              {t('navbar.login')}
            </Button>
            <Button colorScheme="teal" variant="solid">
              {t('navbar.register')}
            </Button>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box textAlign="center" py={20}>
          <Heading as="h2" size="2xl" mb={4}>
            {t('homePage.hero.title')}
          </Heading>
          <Text fontSize="xl" mb={8} maxW="container.md" mx="auto">
            {t('homePage.hero.subtitle')}
          </Text>
          <Box display="flex" gap={4} justifyContent="center">
            <Button colorScheme="teal" size="lg">
              {t('homePage.hero.button.startChatting')}
            </Button>
            <Button colorScheme="teal" variant="outline" size="lg">
              {t('homePage.hero.button.viewPricing')}
            </Button>
          </Box>
          <Text mt={4} fontSize="sm" color="gray.600">
            {t('homePage.hero.authPrompt.prefix')}{' '}
            <Button variant="link" colorScheme="teal" mx={1}>
              {t('homePage.hero.authPrompt.loginLink')}
            </Button>{' '}
            {t('homePage.hero.authPrompt.separator')}{' '}
            <Button variant="link" colorScheme="teal" mx={1}>
              {t('homePage.hero.authPrompt.registerLink')}
            </Button>{' '}
            {t('homePage.hero.authPrompt.suffix')}
          </Text>
        </Box>

        {/* How It Works */}
        <Box py={20}>
          <Heading as="h3" size="xl" textAlign="center" mb={10}>
            {t('homePage.howItWorks.title')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
            {[1, 2, 3, 4].map((step) => (
              <VStack key={step} gap={4} p={6} bg="white" rounded="lg" shadow="md">
                <Text fontSize="2xl" fontWeight="bold" color="teal.500">
                  {step}
                </Text>
                <Heading as="h4" size="md" textAlign="center">
                  {t(`homePage.howItWorks.step${step}.title`)}
                </Heading>
                <Text textAlign="center">
                  {t(`homePage.howItWorks.step${step}.description`)}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Feature Spotlight */}
        <Box py={20}>
          <Heading as="h3" size="xl" textAlign="center" mb={10}>
            {t('homePage.featureSpotlight.title')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
            {['codePlayground', 'imageGenerator', 'fileConverter'].map((feature) => (
              <VStack key={feature} gap={4} p={6} bg="white" rounded="lg" shadow="md">
                <Icon
                  as={feature === 'codePlayground' ? FaCode : feature === 'imageGenerator' ? FaImage : FaFileAlt}
                  boxSize={8}
                  color="teal.500"
                />
                <Heading as="h4" size="md" textAlign="center">
                  {t(`homePage.featureSpotlight.${feature}.title`)}
                </Heading>
                <Text textAlign="center">
                  {t(`homePage.featureSpotlight.${feature}.description`)}
                </Text>
                <Button colorScheme="teal" variant="outline">
                  {t(`homePage.featureSpotlight.${feature}.link`)}
                </Button>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Key Features */}
        <Box py={20}>
          <Heading as="h3" size="xl" textAlign="center" mb={10}>
            {t('homePage.features.title')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={10}>
            {['bilingual', 'imageAnalysis', 'diagramGeneration', 'voiceInput'].map((feature) => (
              <VStack key={feature} gap={4} p={6} bg="white" rounded="lg" shadow="md">
                <Icon
                  as={
                    feature === 'bilingual' ? FaUserFriends :
                    feature === 'imageAnalysis' ? FaImage :
                    feature === 'diagramGeneration' ? FaCode :
                    FaMicrophone
                  }
                  boxSize={8}
                  color="teal.500"
                />
                <Heading as="h4" size="md" textAlign="center">
                  {t(`homePage.features.${feature}.title`)}
                </Heading>
                <Text textAlign="center">
                  {t(`homePage.features.${feature}.description`)}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Why Choose Us */}
        <Box py={20}>
          <Heading as="h3" size="xl" textAlign="center" mb={10}>
            {t('homePage.whyChooseUs.title')}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={10}>
            {['userFriendly', 'cuttingEdgeAI', 'securePrivate'].map((feature) => (
              <VStack key={feature} gap={4} p={6} bg="white" rounded="lg" shadow="md">
                <Icon
                  as={
                    feature === 'userFriendly' ? FaUserFriends :
                    feature === 'cuttingEdgeAI' ? FaRobot :
                    FaShieldAlt
                  }
                  boxSize={8}
                  color="teal.500"
                />
                <Heading as="h4" size="md" textAlign="center">
                  {t(`homePage.whyChooseUs.${feature}.title`)}
                </Heading>
                <Text textAlign="center">
                  {t(`homePage.whyChooseUs.${feature}.description`)}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Meet the Creator */}
        <Box py={20} textAlign="center">
          <Heading as="h3" size="xl" mb={4}>
            {t('homePage.meetTheCreator.title')}
          </Heading>
          <Text fontSize="xl" mb={4}>
            {t('homePage.meetTheCreator.name')}
          </Text>
          <Text maxW="container.md" mx="auto">
            {t('homePage.meetTheCreator.bio')}
          </Text>
        </Box>

        {/* Discover Section */}
        <Box py={20} textAlign="center">
          <Heading as="h3" size="xl" mb={4}>
            {t('homePage.discover.title')}
          </Heading>
          <Text fontSize="xl" mb={8} maxW="container.md" mx="auto">
            {t('homePage.discover.subtitle')}
          </Text>
          <Button colorScheme="teal" size="lg">
            {t('homePage.discover.button.explore')}
          </Button>
        </Box>

        {/* Powered by AI */}
        <Box py={20} textAlign="center" bg="gray.100" rounded="lg">
          <Heading as="h3" size="xl" mb={4}>
            {t('homePage.poweredByAI.title')}
          </Heading>
          <Text fontSize="xl" maxW="container.md" mx="auto">
            {t('homePage.poweredByAI.subtitle')}
          </Text>
        </Box>

        {/* Footer */}
        <Box as="footer" py={10} textAlign="center">
          <Divider mb={6} />
          <Text color="gray.600">
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
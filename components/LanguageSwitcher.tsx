import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'km', label: 'ខ្មែរ' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: languageCode });
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
        {languages.find(lang => lang.code === router.locale)?.label || 'English'}
      </MenuButton>
      <MenuList>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            fontWeight={router.locale === language.code ? 'bold' : 'normal'}
          >
            {language.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher; 
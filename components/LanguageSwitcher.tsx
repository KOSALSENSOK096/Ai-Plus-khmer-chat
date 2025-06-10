import { Button, Menu, MenuButton, MenuList, MenuItem, useColorMode } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { colorMode } = useColorMode();

  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<ChevronDownIcon />} 
        variant="ghost"
        color={colorMode === 'dark' ? 'white' : 'gray.800'}
      >
        {language === 'en' ? 'EN' : 'ខ្មែរ'}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setLanguage('en')} value="en">English</MenuItem>
        <MenuItem onClick={() => setLanguage('km')} value="km">ខ្មែរ</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher; 
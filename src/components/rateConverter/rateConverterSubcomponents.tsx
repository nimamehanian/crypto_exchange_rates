import { useState, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { $hText, $inputText, $white } from '@styles/colors';
import { disableHighlight, transition, alpha } from '@styles/mixins';
import currencies from '@utils/currencies';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export const RateConverterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Walsh Reg';
  h1 {
    font-size: 48px;
    color: ${$hText};
  }
`;

export const InputGroup = styled.div`
  position: relative;
  width: 98vw;
  max-width: 359px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ValueInput = styled.input`
  position: absolute;
  z-index: 1;
  background: #f6f9fc;
  border: none;
  border-radius: 6px;
  outline: none;
  color: ${$inputText};
  font-size: 32px;
  padding: 16px 0px 16px 8px;
  font-family: 'Inter Reg';
  width: 100%;
  caret-color: #96f;
  box-shadow: 0px 4px 6px rgba(50, 50, 93, 0.11),
    0px 1px 3px rgba(0, 0, 0, 0.08);
`;

export const UpDownArrowMask = styled.div`
  position: absolute;
  right: -4px;
  z-index: 2;
  height: 44px;
  width: 32px;
  background: #f6f9fc;
  border: 1px solid #f6f9fc;
`;

const CurrencySelectorWrapper = styled.div`
  position: absolute;
  right: 8px;
  z-index: 3;
`;

const Toggler = styled.div`
  height: 44px;
  width: 92px;
  padding-left: 4px;
  background: ${$white};
  border-radius: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #0a2540;
  font-family: 'FiraMono Med';
  font-size: 18px;
  ${disableHighlight}
`;

const Screen = styled.div`
  position: fixed;
  z-index: 4;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`;

const DropdownWrapper = styled.div`
  position: absolute;
  right: 0px;
  top: 60px;
  width: 96px;
  height: 154px;
  background: ${$white};
  padding: 4px;
  overflow: scroll;
  box-shadow: 0px 4px 6px rgba(50, 50, 93, 0.11),
    0px 1px 3px rgba(0, 0, 0, 0.08);
  z-index: 5;
`;

const LineItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0px 2px 0px 12px;
  text-align: right;
  height: 44px;
  border-radius: 4px;
  color: #0a2540;
  font-family: 'FiraMono Med';
  font-size: 18px;
  cursor: pointer;
  ${disableHighlight}
  ${transition}
  &:hover {
    background: ${alpha('#9966ff', 3)}
  }
  .ticker {
    margin-left: 9px;
  }
`;

type TCurrency = {
  ticker: string;
  image: string;
}

interface IDropdown {
  setChosenCurrency: Dispatcher<TCurrency>;
  setIsDropdownVisible: Dispatcher<boolean>;
}

function Dropdown({ setChosenCurrency, setIsDropdownVisible }: IDropdown) {
  function handleClick({ ticker, image }: TCurrency) {
    setChosenCurrency({ ticker, image });
    setIsDropdownVisible(false);
  }

  return (
    <DropdownWrapper>
      {currencies.map(({ ticker, image }) => (
        <LineItem key={ticker} onClick={() => handleClick({ ticker, image })}>
          <Image
            src={image}
            alt={ticker}
            quality={100}
            width={24}
            height={24}
          />
          <span className='ticker'>{ticker}</span>
        </LineItem>
      ))}
    </DropdownWrapper>
  );
}

function DownArrow() {
  return (
    <svg
      className='down-arrow'
      width='14'
      height='14'
      viewBox='0 0 10 10'
      style={{ transform: 'rotate(90deg) translate(3px, 2px' }}
    >
      <g fillRule='evenodd' fill={'#0a2540'}>
        <path className='tip' d='M1 1l4 4-4 4' />
      </g>
    </svg>
  );
}

type TCurrencySelector = (
  TCurrency &
  { setChosenCurrency: Dispatcher<TCurrency>; }
);

export const CurrencySelector = ({ ticker, image, setChosenCurrency }: TCurrencySelector) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);

  return (
    <CurrencySelectorWrapper>
      <Toggler onClick={() => setIsDropdownVisible(true)}>
        <Image
          src={image}
          alt={ticker}
          quality={100}
          width={24}
          height={24}
        />
        <span>{ticker}</span>
        <DownArrow />
      </Toggler>
      {isDropdownVisible && <Screen onClick={() => setIsDropdownVisible(false)} />}
      {isDropdownVisible && (
        <Dropdown
          setChosenCurrency={setChosenCurrency}
          setIsDropdownVisible={setIsDropdownVisible}
        />
      )}
    </CurrencySelectorWrapper>
  );
};

const ConvertedPriceList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 940px;
  margin: 24px 0px;
  padding: 16px;
  overflow: scroll;
`;

const ConvertedPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  width: 359px;
  margin-bottom: 4px;
  background: #f6f9fc;
  box-shadow: 0px 4px 6px rgba(50, 50, 93, 0.11),
    0px 1px 3px rgba(0, 0, 0, 0.08);
  font-family: 'FiraMono Med';
  font-size: 18px;
  color: #0a2540;
  p {
    margin-left: 8px;
  }
`;

const Label = styled.div`
  width: 92px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 6px;
  img {
    ${disableHighlight}
  }
`;

export const ConvertedPrices = () => {
  return (
    <ConvertedPriceList>
      {currencies.map(({ ticker, image }) => (
        // Pipe in results then map over them with ConvertedPrice
        <ConvertedPrice key={`${ticker}_price`}>
          <p>{1337.888}</p>
          <Label>
            <Image
              src={image}
              alt={ticker}
              quality={100}
              width={24}
              height={24}
            />
            <span>{ticker}</span>
            <div className='placeholder' style={{ width: '14px' }} />
          </Label>
        </ConvertedPrice>
      ))}
    </ConvertedPriceList>
  );
};

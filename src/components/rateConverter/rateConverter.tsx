import { useEffect, useState, ChangeEvent } from 'react';
import useDebounce from '@utils/useDebounce';
import { ajax } from 'rxjs/ajax';
import { forkJoin, from } from 'rxjs';
import { map, mergeMap, toArray, tap } from 'rxjs/operators';
import currencies from '@utils/currencies';
import {
  RateConverterWrapper,
  InputGroup,
  ValueInput,
  UpDownArrowMask,
  CurrencySelector,
  ConvertedPrices,
} from '@components/rateConverter/rateConverterSubcomponents';

function RateConverter() {
  const [{ fieldValue }, setFieldValue] = useState({ fieldValue: '10000.00' });
  const [{ ticker, image }, setChosenCurrency] = useState({
    ticker: 'USD',
    image: '/images/USD.png',
  });
  // const [results, setResults] = useState([]);
  // const [hasResolved, setHasResolved] = useState(false);
  const debouncedFieldValue = useDebounce(fieldValue, 444);
  const useUpholdApi = false;

  useEffect(() => {
    const apiUrl = (product: string) => (
      // e.g., 'BTC-USD'
      useUpholdApi ?
        `https://api.uphold.com/v0/ticker/${product}` :
        `https://api.coinbase.com/v2/prices/${product}/buy`
    );

    (async function getPrices() {
      // console.log('getting prices...');

      // @ts-ignore
      const products = currencies.reduce((p, c) => (
        [...p, `${c.ticker}-${ticker}`]
      ), []);

      // @ts-ignore
      from(products).pipe(
        // Make an Observable collection of pairs. e.g., BTC-USD, ETH-USD
        // Pipe each to the apiUrl method to form all endpoints that will be hit
        map(product => apiUrl(product)),
        // Turn all these endpoints into request objects, ready to be called
        map(url => ajax({
          url,
        })),
        // Observables pass through pipes one at a time, but
        // forkJoin needs its argument as an array, so we momentarily
        // pool all requests together into a collection
        toArray(),
        // Now forkJoin calls all requests in parallel, and awaits
        // their resolution, in any order
        mergeMap(requests => forkJoin(requests)),
        // Once they are all resolved, we map through the response data
        // and transform it to look however we'd like
        mergeMap((responses) => responses.map(({ response }) => (
          // setresults here:
          // reduce over collection, take bid/ask average, and
          // return price in terms of amount in fieldValue
          { response }
        ))),
        // tap(x => console.log(x)),
      ).subscribe();
    })();
    // When any of these values change, the process runs again
  }, [debouncedFieldValue, ticker, useUpholdApi]);

  function handleValueChange(event: ChangeEvent<HTMLInputElement>) {
    setFieldValue({ fieldValue: event.target.value });
  }

  return (
    <RateConverterWrapper>
      {/* NICE-TO-HAVES: */}
      {/* PREFIX MONETARY SYMBOLS */}
      {/* INPUT FIELD TO FILTER CURRENCIES */}
      {/* WATCHLIST (localStorage) */}
      {/* MAKE SORTBY: ALPHABETICAL || PRICE */}

      <h1>Rate Converter</h1>
      <InputGroup>
        <ValueInput
          type='number'
          step='0.01'
          value={fieldValue}
          onChange={handleValueChange}
          // Prevent up and down arrows from altering values,
          // and prevent insertion of `e` exponential character
          onKeyDown={(event) => (
            ['ArrowUp', 'ArrowDown', 'KeyE'].includes(event.code) ?
              event.preventDefault() : event
          )}
          // Prevent scrolling from altering field values, and
          // alias `event.target` as `HTMLInputElement` so that..
          // ..TypeScript recognizes the `blur` method
          onWheel={(event) => (event.target as HTMLInputElement).blur()}
        />
        <UpDownArrowMask />
        <CurrencySelector
          ticker={ticker}
          image={image}
          setChosenCurrency={setChosenCurrency}
        />
      </InputGroup>
      <ConvertedPrices />
    </RateConverterWrapper>
  );
}

export default RateConverter;

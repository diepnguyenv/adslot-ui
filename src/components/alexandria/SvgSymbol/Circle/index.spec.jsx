/* eslint-disable lodash/prefer-lodash-method */
import React from 'react';
import { shallow } from 'enzyme';
import SvgSymbol from 'components/alexandria/SvgSymbol';
import SvgSymbolCircle from '.';

describe('SvgSymbolCircle', () => {
  it('should render with defaults', () => {
    const component = shallow(<SvgSymbolCircle />);
    expect(component.prop('className')).to.equal('svgsymbolcircle-component');

    const svgSymbolEl = component.find(SvgSymbol);
    expect(svgSymbolEl.prop('classSuffixes')).to.have.length(0);
    expect(svgSymbolEl.prop('href')).to.equal(undefined);
  });

  it('should render with props', () => {
    const component = shallow(<SvgSymbolCircle href="foo#bar" classSuffixes={['70']} />);
    expect(component.prop('className')).to.equal('svgsymbolcircle-component svgsymbolcircle-component-70');

    const svgSymbolEl = component.find(SvgSymbol);
    expect(svgSymbolEl.prop('classSuffixes')).to.deep.equal(['70']);
    expect(svgSymbolEl.prop('href')).to.equal('foo#bar');
  });
});

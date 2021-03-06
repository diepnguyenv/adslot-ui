import React from 'react';
import { shallow } from 'enzyme';
import classSuffixHelper from 'helpers/classSuffixHelper';
import GridRow from '.';

describe('GridRow', () => {
  const componentClass = 'grid-component-row';
  const getClassNames = (classSuffixes) => {
    const classNames = classSuffixHelper({ classSuffixes, componentClass });
    return `${componentClass}${classNames}`;
  };

  it('should render with defaults', () => {
    const component = shallow(<GridRow />);
    expect(component.prop('className')).to.equal(getClassNames(['body', 'horizontal-border']));
    expect(component.children()).to.have.length(0);
    expect(component.prop('data-test-selector')).to.be.an('undefined');
  });

  it('should pass through children', () => {
    const children = <div className="test-class">Party town</div>;
    const component = shallow(<GridRow>{children}</GridRow>);
    expect(component.prop('className')).to.equal(getClassNames(['body', 'horizontal-border']));

    const childElement = component.children();
    expect(childElement.prop('className')).to.equal('test-class');
    expect(childElement.text()).to.equal('Party town');
  });

  it('should have no horizontalBorder class when horizontalBorder is false', () => {
    const component = shallow(<GridRow horizontalBorder={false} />);
    expect(component.prop('className')).to.equal(getClassNames(['body']));
  });

  it('should apply short class when short is true', () => {
    const component = shallow(<GridRow short />);
    expect(component.prop('className')).to.equal(getClassNames(['body', 'horizontal-border', 'short']));
  });

  it('should apply header class instead of body when type is header', () => {
    const component = shallow(<GridRow type="header" />);
    expect(component.prop('className')).to.equal(getClassNames(['header', 'horizontal-border']));
  });

  it('should apply subfooter class instead of body when type is subfooter', () => {
    const component = shallow(<GridRow type="subfooter" />);
    expect(component.prop('className')).to.equal(getClassNames(['subfooter', 'horizontal-border']));
  });

  it('should apply footer class instead of body when type is footer', () => {
    const component = shallow(<GridRow type="footer" />);
    expect(component.prop('className')).to.equal(getClassNames(['footer', 'horizontal-border']));
  });

  it('should apply vertical-cell-border class when verticalCellBorder is true', () => {
    const component = shallow(<GridRow verticalCellBorder />);
    expect(component.prop('className')).to.equal(getClassNames(['body', 'horizontal-border', 'vertical-cell-border']));
  });

  it('should apply data-test-selector', () => {
    const component = shallow(<GridRow dts="this-has-data-test-selector" />);
    expect(component.prop('data-test-selector')).to.equal('this-has-data-test-selector');
  });
});

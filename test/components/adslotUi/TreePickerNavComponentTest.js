import _ from 'lodash';
import React from 'react';
import TreePickerNavComponent from 'components/adslotUi/TreePickerNavComponent';
import { Breadcrumb, Search } from 'alexandria-adslot';
import { shallow } from 'enzyme';

describe('TreePickerNavComponent', () => {
  it('should render with defaults', () => {
    const component = shallow(<TreePickerNavComponent />);
    expect(component.prop('className')).to.equal('treepickernav-component');
    expect(component.children()).to.have.length(2);

    const searchElement = component.find(Search);
    expect(searchElement).to.have.length(1);

    const breadcrumbElement = component.find(Breadcrumb);
    expect(breadcrumbElement).to.have.length(1);
  });

  it('should render with props', () => {
    const testFunction = _.noop;
    const breadcrumbNodes = [
      { id: 'a', label: 'UK' },
      { id: 'b', label: 'London' },
    ];
    const props = {
      breadcrumbNodes,
      breadcrumbOnClick: testFunction,
      searchOnChange: testFunction,
      searchOnClear: testFunction,
      searchValue: 'needle',
    };
    const component = shallow(<TreePickerNavComponent {...props} />);
    expect(component.prop('className')).to.equal('treepickernav-component');
    expect(component.children()).to.have.length(2);

    const searchElement = component.find(Search);
    expect(searchElement.prop('onChange')).to.equal(testFunction);
    expect(searchElement.prop('onClear')).to.equal(testFunction);
    expect(searchElement.prop('value')).to.equal('needle');

    const breadcrumbElement = component.find(Breadcrumb);
    expect(breadcrumbElement.prop('nodes')).to.equal(breadcrumbNodes);
    expect(breadcrumbElement.prop('onClick')).to.equal(testFunction);
  });

  it('should not render breadcrumbs if disabled', () => {
    const component = shallow(<TreePickerNavComponent disabled />);
    const breadcrumbElement = component.find(Breadcrumb);
    expect(breadcrumbElement).to.have.length(0);
  });
});

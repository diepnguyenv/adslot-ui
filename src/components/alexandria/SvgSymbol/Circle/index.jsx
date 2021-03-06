import React, { PropTypes } from 'react';
import SvgSymbol from 'components/alexandria/SvgSymbol';
import classSuffixHelper from '../../../../helpers/classSuffixHelper';
import './styles.scss';

const SvgSymbolCircle = (props) => {
  const componentClass = 'svgsymbolcircle-component';
  const classesList = classSuffixHelper({ classSuffixes: props.classSuffixes, componentClass });
  return (
    <div className={`${componentClass}${classesList}`}>
      <SvgSymbol classSuffixes={props.classSuffixes} href={props.href} {...props} />
    </div>
  );
};

SvgSymbolCircle.displayName = 'AlexandriaSvgSymbolCircleComponent';

SvgSymbolCircle.propTypes = {
  classSuffixes: SvgSymbol.propTypes.classSuffixes,
  href: PropTypes.string,
};

export default SvgSymbolCircle;

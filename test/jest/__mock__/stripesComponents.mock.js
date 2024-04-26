import React from 'react';

jest.mock('@folio/stripes/components', () => ({
  Badge: jest.fn((props) => (
    <span>
      <span>{props.children}</span>
    </span>
  )),
  TextLink: jest.fn(({ children, onClick }) => (
    <button type="button" onClick={onClick}>
      <span>{children}</span>
    </button>
  )),
  Button: jest.fn(({ children, onClick, ...rest }) => (
    <button {...rest} onClick={onClick} type="button">
      {children}
    </button>
  )),
  InfoPopover: jest.fn(({ content }) => <div>{content}</div>),
  ConfirmationModal: jest.fn(({ heading, message, onConfirm, onCancel, cancelLabel, confirmLabel, open }) => (
    open ? (
      <div data-testid="ConfirmationModal">
        <span>ConfirmationModal</span>
        {heading}
        <div>{message}</div>
        <div>
          <button type="button" data-testid="conformation" onClick={onConfirm}>{confirmLabel || 'confirm'}</button>
          <button type="button" data-testid="cancel" onClick={onCancel}>{ cancelLabel || 'cancel'}</button>
        </div>
      </div>
    ) : ('')
  )),
  Col: jest.fn(({ children }) => <div className="col">{children}</div>),
  Datepicker: jest.fn(({ ref, children, ...rest }) => (
    <div ref={ref} {...rest}>
      {children}
      <input type="text" />
    </div>
  )),
  FilterGroups: jest.fn(({ config, filters, onChangeFilter }) => (
    <div>
      {JSON.stringify(config)}
      {JSON.stringify(filters)}
      {JSON.stringify(onChangeFilter)}
    </div>
  )),
  Headline: jest.fn(({ children }) => <div>{children}</div>),
  Icon: jest.fn((props) => (props && props.children ? props.children :
  <span />)),
  IconButton: jest.fn(({
    buttonProps,
    // eslint-disable-next-line no-unused-vars
    iconClassName,
    ...rest
  }) => (
    <button type="button" {...buttonProps}>
      <span {...rest} />
    </button>
  )),
  Label: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  // oy, dismissible. we need to pull it out of props so it doesn't
  // get applied to the div as an attribute, which must have a string-value,
  // which will shame you in the console:
  //
  //     Warning: Received `true` for a non-boolean attribute `dismissible`.
  //     If you want to write it to the DOM, pass a string instead: dismissible="true" or dismissible={value.toString()}.
  //         in div (created by mockConstructor)
  //
  // is there a better way to throw it away? If we don't destructure and
  // instead access props.label and props.children, then we get a test
  // failure that the modal isn't visible. oy, dismissible.
  Modal: jest.fn(({
    children,
    label,
    dismissible,
    closeOnBackgroundClick,
    ...rest
  }) => {
    return (
      <div
        data-test={dismissible ? '' : ''}
        onClick={closeOnBackgroundClick ? jest.fn() : undefined}
        {...rest}
      >
        <h1>{label}</h1>
        {children}
      </div>
    );
  }),
  ModalFooter: jest.fn((props) => (
    <div>{props.children}</div>
  )),
  Selection: jest.fn(({ children, dataOptions, onChange, label, name }) => (
      <label>
        {label}
        <select name={name} onChange={(event) => {
          onChange(event.target.value)
        }}>
          {dataOptions.map((option, i) => (
              <option
                  value={option.value}
                  key={option.id || `option-${i}`}
                  selected={option.selected}
              >
                {option.label}
              </option>))}
        </select>
        {children}
      </label>
  )),
  MultiSelection: jest.fn(({ children, dataOptions }) => (
    <div>
      <select multiple>
        {dataOptions.forEach((option, i) => (
          <option
            value={option.value}
            key={option.id || `option-${i}`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {children}
    </div>
  )),
  NavList: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListItem: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  NavListSection: jest.fn(({ children, className, ...rest }) => (
    <div className={className} {...rest}>{children}</div>
  )),
  Pane: jest.fn(({
    children,
    className,
    defaultWidth,
    paneTitle,
    paneSub,
    firstMenu,
    lastMenu,
    onClose,
    fluidContentWidth,
    appIcon,
    dismissible,
    footer,
    ...rest
  }) => {
    return (
      <div
        data-testid="Pane"
        className={className}
        {...rest}
        style={!fluidContentWidth ? { width: '960px' } : { width: defaultWidth }}
        data-appicon={appIcon}
      >
        <div>
          {dismissible &&
            <button onClick={onClose} aria-label="Close button" type="button" />}

          {firstMenu ?? null}
          {paneTitle}
          {lastMenu ?? null}
          {paneSub}
        </div>
        {children}
        {footer}
      </div>
    );
  }),
  Paneset: jest.fn(({ children, defaultWidth, isRoot, ...rest }) => {
    return (
      <div data-testid="Paneset" {...rest} style={{ width: defaultWidth }}>
        {children}
        {isRoot && <div className="container" />}
      </div>
    );
  }),
  PaneFooter: jest.fn(({ ref, children, renderStart, renderEnd, ...rest }) => (
    <div ref={ref} {...rest}>{renderStart}{children}{renderEnd}</div>
  )),
  PaneHeader: jest.fn(({ paneTitle, firstMenu, lastMenu }) => (
    <footer aria-label="pane-footer">
      {firstMenu ?? null}
      {paneTitle}
      {lastMenu ?? null}
    </footer>
  )),
  MessageBanner: jest.fn(({ show, children }) => {
    return show ? <div data-testid="success-banner">{children}</div> : <></>;
  }),
  Layout: jest.fn(({
    children,
    'data-testid': testId,
  }) => (
    <div data-testid={testId}>
      {children}
    </div>
  )),
  PaneBackLink: jest.fn(() => <span />),
  PaneMenu: jest.fn((props) => <div>{props.children}</div>),
  RadioButton: jest.fn(({ label, name, ...rest }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        aria-label={rest.value}
        type="radio"
        name={name}
        {...rest}
      />
    </div>
  )),
  RadioButtonGroup: jest.fn(({ label, children, ...rest }) => (
    <fieldset {...rest}>
      <legend>{label}</legend>
      {children}
    </fieldset>
  )),
  Row: jest.fn(({ children }) => <div className="row">{children}</div>),
  SearchField: jest.fn(({ ariaLabel, className }) => <div aria-label={ariaLabel} className={className} />),
  Select: jest.fn(({ children, dataOptions, onChange, label, name }) => (
    <label>
      {label}
      <select name={name} onChange={onChange}>
        {dataOptions.map((option, i) => (
          <option
            value={option.value}
            key={option.id || `option-${i}`}
            selected={option.selected}
          >
            {option.label}
          </option>))}
      </select>
      {children}
    </label>
  )),
  Loading: jest.fn(() => <div>Loading</div>),
  LoadingPane: jest.fn(() => <div>LoadingPane</div>),
  MultiColumnList: jest.fn((props) => (
    <div data-testid={props['data-testid']} />
  )),
  Layer: jest.fn(({ children, isOpen, contentLabel, ...rest }) => (
    <div aria-label={contentLabel} {...rest}>{isOpen ? children : ''}</div>
  )),
  Accordion: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  AccordionSet: jest.fn(({ children, ...rest }) => (
    <span {...rest}>{children}</span>
  )),
  KeyValue: jest.fn(({ label, children, value }) => (
    <>
      <span>{label}</span>
      <span>{value || children}</span>
    </>
  )),
  MetaSection: jest.fn(({
    children,
    contentId,
    createdDate,
    lastUpdatedDate,
    createdBy,
    lastUpdatedBy,
    ...rest
  }) => (
    <div {...rest}>
      <button type="button" aria-controls={contentId}>
        <div>
          {createdDate} {createdBy}
          {lastUpdatedDate} {lastUpdatedBy}
          {children}
        </div>
      </button>
    </div>
  )),
  Dropdown: jest.fn(({
    children,
    buttonProps,
    buttonStyle,
    bottomMargin0,
    ...rest
  }) => (
    <div {...rest}>
      <button
        type="button"
        style={{
          backgroundColor: buttonStyle === 'primary' ? '#1960a4' : 'transparent',
          margin: bottomMargin0 ? '0px' : '14px'
        }}
        {...buttonProps}
      >
        <span {...rest} />
      </button>
      {children}
    </div>)),
  DropdownMenu: jest.fn(({ children, ...rest }) => <div {...rest}>{children}</div>),
  TextArea: jest.fn((props) => (
    <div>
      <label htmlFor={props.label}>{props.label}</label>
      <textarea
        id={props.label}
        value={props.value}
        cols="30"
        rows="10"
      />
    </div>)),
  TextField: jest.fn(({
    label,
    onChange,
    validate = jest.fn(),
    ...rest
  }) => {
    const handleChange = (e) => {
      validate(e.target.value);
      onChange(e);
    };

    return (
      <div>
        <label htmlFor="textField">{label}</label>
        <input
          id="textField"
          onChange={handleChange}
          {...rest}
        />
      </div>
    );
  }),
  Tooltip: jest.fn(({
    children,
    text,
    ...rest
  }) => (
    <div {...rest}>
      {text}
      {children}
    </div>
  )),
  Checkbox: jest.fn(({
    label,
    checked,
    value,
    onChange,
    disabled,
    ...rest
  }) => {
    return (
      <div data-test-checkbox="true" {...rest}>
        <label htmlFor="checkbox">
          <input
            id="checkbox"
            type="checkbox"
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <span className="labelText">{label}</span>
        </label>
      </div>
    );
  })
}));

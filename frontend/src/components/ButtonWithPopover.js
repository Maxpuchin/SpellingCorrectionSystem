import React from "react";
import PropTypes from "prop-types";
import { Popover, Button, IconButton } from "@mui/material";

class ButtonWithPopover extends React.Component {
  constructor(props) {
    super(props);

    this.state = { anchorEl: null };
  }

  closePopover() {
    this.setState({ anchorEl: null });
  }

  render() {
    const {
      variant,
      size,
      label,
      iconClass,
      labelClass,
      labelStyle,
      style,
      className
    } = this.props;

    return (
      <>
        {variant === "button" && (
          <Button
            variant="outlined"
            color="error"
            
            size={size}
            style={{padding: "0px", marginLeft: "2px", marginRight: "2px"}}
            className={labelClass ? labelClass : null}
            onClick={e => {
              this.setState({ anchorEl: e.currentTarget });
            }}
          >
            {iconClass && (
              <i className={`${iconClass}`} style={{ marginRight: "0.3rem" }} />
            )}
            {label}
          </Button>
        )}
        {variant === "icon" && (
          <IconButton
            size={size}
            onClick={e => {
              this.setState({ anchorEl: e.currentTarget });
            }}
          >
            <i className={`${iconClass}`} />
          </IconButton>
        )}

        <Popover
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.closePopover.bind(this)}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div
            style={{margin: "1rem", color: "darkgreen"}}
            className={className ? className : null}
          >
            {this.props.children}
          </div>
        </Popover>
      </>
    );
  }
}

ButtonWithPopover.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  labelStyle: PropTypes.object,
  iconClass: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.any
};

ButtonWithPopover.defaultProps = {
  variant: "button",
  size: "medium"
};

export default ButtonWithPopover;

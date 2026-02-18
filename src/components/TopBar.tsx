import React from 'react';

type ActiveSection = 'analytics' | 'audit' | 'packages' | 'account';

interface TopBarProps {
  activeSection: ActiveSection;
  showCheckout: boolean;
  showThankYou: boolean;
  onOpenCart: () => void;
  onBackToDashboards: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  showCheckout,
  showThankYou,
  onOpenCart,
  onBackToDashboards,
}) => {
  const showCheckoutFlow = showCheckout || showThankYou;

  let title: string;
  let subtitle: string;
  if (showCheckoutFlow) {
    title = 'CHECKOUT';
    subtitle = 'Shipping & Billing';
  } else if (activeSection === 'analytics') {
    title = 'Analytics';
    subtitle = 'View Recent Schemas Below, See All in Schema History.';
  } else if (activeSection === 'audit') {
    title = 'Audit Report';
    subtitle = 'View Recent Schemas Below, See All in Schema History.';
  } else if (activeSection === 'packages') {
    title = 'Packages';
    subtitle = 'Choose the plan that fits your business and start growing today.';
  } else {
    title = 'Account';
    subtitle = 'Manage your subscription, update your details, and keep everything in one place.';
  }

  return (
    <header className="top-bar">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {showCheckoutFlow ? (
        <button className="cart-button" type="button" onClick={onBackToDashboards}>
          Back to Dashboards
        </button>
      ) : (
        <button className="cart-button" type="button" onClick={onOpenCart}>
          Shopping cart
        </button>
      )}
    </header>
  );
};

export default TopBar;

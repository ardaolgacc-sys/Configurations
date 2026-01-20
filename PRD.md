# Planning Guide

A configuration interface for managing advertising campaign optimization settings with focus controls, bid parameters, target types, and optimization options.

**Experience Qualities**:
1. **Professional** - Clean, structured layout that communicates reliability and precision for ad campaign management
2. **Efficient** - Streamlined single-page interface with clear sections and minimal navigation
3. **Informative** - Rich tooltips and recommended values guide users to make optimal configuration choices

**Complexity Level**: Light Application (multiple features with basic state)
This is a configuration form with multiple related settings, radio groups, dropdowns, and state persistence. The interface collects campaign optimization parameters without complex workflows or multiple views.

## Essential Features

**Focus Selection**
- Functionality: Radio group allowing selection between Growth Focused, Lean Growth, Balanced Approach, Lean Profit, and Profit Focused strategies
- Purpose: Defines the primary campaign optimization strategy
- Trigger: User clicks on a radio option
- Progression: User clicks radio → Selection updates → Focus value stored
- Success criteria: Only one focus can be selected at a time, selection persists

**Bid Range Configuration**
- Functionality: Displays Min Bid and Max Bid fields with recommended values and info tooltips
- Purpose: Sets the bidding boundaries for ad campaigns
- Trigger: User views the Focus section
- Progression: System shows current values → Displays recommended values with sync icons
- Success criteria: Values are clearly displayed with recommendations visible

**Target Type Selection**
- Functionality: Radio toggle between ACoS and TACoS with breakeven calculation display
- Purpose: Determines the target advertising cost metric
- Trigger: User clicks ACoS or TACoS radio button
- Progression: User selects type → Percentage input shown → Breakeven calculation displayed
- Success criteria: Toggle updates, percentage value persists, breakeven shows correctly

**Optimization Settings**
- Functionality: Three dropdown selectors for Daily Bidding, Negation, and Campaign Creation
- Purpose: Configures automated optimization behaviors
- Trigger: User clicks dropdown
- Progression: User clicks dropdown → Options display → User selects option → Dropdown updates
- Success criteria: Selected values persist and display correctly

**Clear and Save Actions**
- Functionality: Clear Inputs button resets form, Save Goals button persists configuration
- Purpose: Allows form reset or saving configured values
- Trigger: User clicks button
- Progression: Clear: Click → Form resets to defaults | Save: Click → Values persist → Success feedback
- Success criteria: Clear resets all fields, Save persists data with confirmation

## Edge Case Handling
- **Missing Selection**: Default to first option in radio groups to ensure valid state
- **Empty Inputs**: Show placeholder text and recommended values as guidance
- **Invalid Percentages**: Validate numeric input for target ACoS/TACoS fields
- **Tooltip Accessibility**: Ensure info icons are keyboard accessible and have ARIA labels

## Design Direction
The design should evoke precision, control, and professionalism fitting for advertising campaign management software. Dark theme with rich navy blues and strategic use of accent colors to guide attention to actionable elements.

## Color Selection
A sophisticated dark interface with electric blue accents and high-contrast text for optimal readability during extended configuration sessions.

- **Primary Color**: Electric Blue (oklch(0.65 0.19 250)) - Communicates technology, precision, and trust; used for active states and primary actions
- **Secondary Colors**: 
  - Deep Navy (oklch(0.18 0.02 250)) - Card backgrounds, provides depth without pure black
  - Slate Gray (oklch(0.35 0.01 250)) - Borders and dividers, subtle separation
- **Accent Color**: Bright Blue (oklch(0.72 0.18 250)) - Save button, selected radio states, draws eye to primary actions
- **Foreground/Background Pairings**: 
  - Primary (Electric Blue oklch(0.65 0.19 250)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Background (Dark Navy oklch(0.15 0.02 250)): Light text (oklch(0.95 0 0)) - Ratio 12.8:1 ✓
  - Card (Deep Navy oklch(0.18 0.02 250)): White text (oklch(1 0 0)) - Ratio 10.5:1 ✓
  - Accent (Bright Blue oklch(0.72 0.18 250)): Dark text (oklch(0.15 0 0)) - Ratio 8.1:1 ✓

## Font Selection
Typography should convey technical precision while maintaining excellent readability for extended configuration work.

- **Primary Font**: Inter - Clean, geometric sans-serif with excellent legibility at all sizes
- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold/24px/tight letter spacing
  - H2 (Section Headers): Inter Medium/11px/wide letter spacing/uppercase
  - Body (Labels, Values): Inter Regular/14px/normal spacing
  - Small (Recommended text): Inter Regular/12px/relaxed spacing

## Animations
Animations should be subtle and functional, reinforcing state changes without distraction.

- Radio selection: Smooth 150ms color transition on state change
- Dropdown expansion: 200ms ease-out slide with subtle fade
- Button hover: 100ms lift effect with slight shadow increase
- Tooltip appearance: 150ms fade-in with micro slide-up
- Save success: Brief pulse on Save Goals button with toast notification

## Component Selection

- **Components**:
  - `RadioGroup` - For Focus selection and Target Type (ACoS/TACoS)
  - `Select` - For Daily Bidding, Negation, and Campaign Creation dropdowns
  - `Button` - For Clear Inputs and Save Goals actions
  - `Card` - For Focus and Optimizations section containers
  - `Label` - For all form field labels
  - `Tooltip` - For info icons providing contextual help
  - `Separator` - For visual division between sections
  - `Tabs` - For Store Settings, Goal Details, and Optimization List navigation
  - Toast (sonner) - For save confirmation feedback

- **Customizations**:
  - Custom radio button styling with blue fill for selected state
  - Info icon buttons with tooltip triggers positioned inline with labels
  - Recommended value displays with sync icons
  - Custom dropdown styling matching the dark theme aesthetic
  - Badge component for displaying breakeven calculation

- **States**:
  - Radio buttons: Default (outlined), Selected (filled with blue), Hover (border brightens)
  - Dropdowns: Closed (dark background), Open (expanded with options), Hover (subtle highlight)
  - Buttons: Default, Hover (lifted with glow), Active (pressed), Disabled (dimmed)
  - Info icons: Default, Hover (tooltip appears), Focus (keyboard accessible)

- **Icon Selection**:
  - `Info` - For tooltip triggers on field labels
  - `ArrowsClockwise` - For recommended value sync indicators
  - `Trash` - For Clear Inputs button
  - `FloppyDisk` - For Save Goals button
  - `CaretDown` - For dropdown indicators

- **Spacing**:
  - Section padding: p-6
  - Card gap: gap-6
  - Form field gap: gap-4
  - Label to input: gap-2
  - Button spacing: px-6 py-2

- **Mobile**:
  - Stack sections vertically on mobile
  - Full-width cards and buttons
  - Maintain generous touch targets (min 44px)
  - Collapsible sections for smaller screens
  - Sticky action buttons at bottom on mobile

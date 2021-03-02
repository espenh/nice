import { party } from "nice-common";

interface IVirtualIceProps {}

export const VirtualIce: React.FunctionComponent<IVirtualIceProps> = (
  props
) => {
  return (
    <div>
      {party} - {somethingelse}
    </div>
  );
};

"use client";

import { Button, Modal } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";

import { appAxios } from "@/http";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "sonner";
import { StoreProvider } from "./AppStoreProvider";
import LoadingModal from "./LoadingModal";

type CreateRoundProps = {
  onClose: () => void;
};

export default function CreateRound({ onClose }: CreateRoundProps) {
  const [startsAt, setStartsAt] = useState<Dayjs | null>(dayjs());
  const { username } = useContext(StoreProvider);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { startDate: string }) => {
      return appAxios.post("/api/v1/rounds", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Round has beedn created");
      queryClient.invalidateQueries({ queryKey: ["rounds", true, username] });
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!startsAt) return;
    // Convert to ISO string with Z
    const isoDate = startsAt.toDate().toISOString();
    mutate({ startDate: isoDate });
  };

  return (
    <Modal open onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Create Round</h2>
        {isPending && <LoadingModal />}
        <DateTimePicker
          label="Start At"
          value={startsAt}
          onChange={(newValue) => setStartsAt(newValue)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

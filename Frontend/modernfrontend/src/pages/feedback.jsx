import { TrashIcon } from "@heroicons/react/24/outline";
import {
  useDeleteFeedbackMutation,
  useGetFeedbackQuery,
} from "../redux/baseapi";

const formatReceivedAt = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getRatingTone = (rating) => {
  const numericRating = Number(rating || 0);

  if (numericRating >= 4) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (numericRating >= 3) {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-rose-50 text-rose-700";
};

const getHouseholdDisplayValue = (household) => {
  if (!household) {
    return "-";
  }

  if (typeof household === "string") {
    return household;
  }

  return household.householdCode || `Household ${household.id}`;
};

const getUserDisplayValue = (user) => {
  if (!user) {
    return "-";
  }

  if (typeof user === "string") {
    return user;
  }

  return user.username || user.email || user.mobile || `User ${user.id}`;
};

const Feedback = () => {
  const {
    data: feedbackResponse = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFeedbackQuery();
  const [deleteFeedback, { isLoading: isDeleting }] =
    useDeleteFeedbackMutation();

  const feedbackRows = Array.isArray(feedbackResponse)
    ? feedbackResponse
    : Array.isArray(feedbackResponse?.data)
      ? feedbackResponse.data
      : [];

  const averageRating =
    feedbackRows.length > 0
      ? (
          feedbackRows.reduce(
            (sum, item) => sum + Number(item.rating || 0),
            0,
          ) / feedbackRows.length
        ).toFixed(1)
      : "0.0";
  const fiveStarReviews = feedbackRows.filter(
    (item) => Number(item.rating) === 5,
  ).length;

  const stats = [
    { label: "Total feedback", value: feedbackRows.length },
    { label: "Average rating", value: averageRating },
    { label: "5 star reviews", value: fiveStarReviews },
  ];

  const errorMessage =
    error?.data?.message || error?.error || "Unable to load feedback.";

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this feedback?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteFeedback(id).unwrap();
      refetch();
    } catch (deleteError) {
      console.error("Failed to delete feedback:", deleteError);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-3">
        {stats.map((card) => (
          <article
            key={card.label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Feedback center
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            Feedback table
          </h3>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Household",
                    "Name",
                    "Appointment Number",
                    "Rating",
                    "Message",
                    "Received At",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-400"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      Loading feedback...
                    </td>
                  </tr>
                ) : null}

                {isError ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-rose-600"
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError && feedbackRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-sm text-slate-500"
                    >
                      No feedback records found.
                    </td>
                  </tr>
                ) : null}

                {!isLoading && !isError
                  ? feedbackRows.map((item) => (
                      <tr key={item.id} className="border-t border-slate-200">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                          <div>
                            <p>{getHouseholdDisplayValue(item.household)}</p>
                            {item.household?.district ||
                            item.household?.state ? (
                              <p className="mt-1 text-xs font-normal text-slate-500">
                                {[
                                  item.household?.district,
                                  item.household?.state,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div>
                            <p className="font-medium text-slate-900">
                              {getUserDisplayValue(item.user)}
                            </p>
                            {item.user?.mobile ? (
                              <p className="mt-1 text-xs text-slate-500">
                                {item.user.mobile}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.appointmentNumber || "-"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-xl ${
                                  star <= Number(item.rating)
                                    ? "text-yellow-400"
                                    : "text-slate-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}                        
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p className="max-w-sm">{item.message || "-"}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatReceivedAt(
                            item.receivedAt || item.createdAt || item.updatedAt,
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label={`Delete feedback ${item.id}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
